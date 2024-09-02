import { Socket } from "socket.io";
import { v4  } from 'uuid';

interface User {
  name: string;
  socket: Socket;
}

interface Room {
  user1: User;
  user2: User;
}

export class UserManager {
  private users: User[] = [];
  private waitingQueue: string[] = [];
  private roomManager: RoomManager = new RoomManager();

  constructor() {}

  addUser(name: string, socket: Socket) {
    console.log("adding user", socket.id);
    this.waitingQueue.push(socket.id);
    this.users.push({ name, socket });
    console.log({ waitingQueue: this.waitingQueue, users: this.users });
    this.checkWaitingQueue();
    this.initSocketHandlers(socket);
  }

  removeUser(socket: Socket) {
    this.users = this.users.filter((user) => user.socket.id !== socket.id);
    this.waitingQueue = this.waitingQueue.filter((id) => id !== socket.id);
    console.log(`removing user ${socket.id}`);
  }

  // this function recursively pops the waiting queue until it no room can be created.
  checkWaitingQueue() {
    console.log("checkingQueue");
    if (this.waitingQueue.length < 2) {
      console.log("no more users to create room");
      console.log("current waiting queue length:", this.waitingQueue.length);
      return;
    }

    const id1 = this.waitingQueue.pop();
    const id2 = this.waitingQueue.pop();

    const user1 = this.users.find((user) => user.socket.id === id1);

    const user2 = this.users.find((user) => user.socket.id === id2);

    if (!user1 || !user2) return;

    this.roomManager.createRoom(user1, user2);

    this.checkWaitingQueue();
  }

  initSocketHandlers(socket: Socket) {
    socket.on("offer", ({ sdp, roomId }: { sdp: string; roomId: string }) => {
      this.roomManager.onOffer(roomId, sdp, socket.id);
    });

    socket.on("answer", ({ sdp, roomId }: { sdp: string; roomId: string }) => {
      this.roomManager.onAnswer(roomId, sdp, socket.id);
    });

    socket.on("add-ice-candidates", ({ candidate, roomId, type }) => {
      this.roomManager.onIceCandidates(roomId, socket.id, candidate, type);
    });
  }
}

class RoomManager {
  private rooms: Map<string, Room> = new Map();

  constructor() {}

  createRoom(user1: User, user2: User) {
    const roomId = v4();

    this.rooms.set(roomId, { user1, user2 });

    console.log("created room:", roomId);

    //once room is created share room id with both users
    user1.socket.emit("send-roomId", { roomId });
    user2.socket.emit("send-roomId", { roomId });
  }

  removeRoom(roomId: string) {
    console.log(`removing room ${roomId}`);
    this.rooms.delete(roomId);
  }

  onOffer(roomId: string, sdp: string, userId: string) {
    console.log("inside offer")
    const room = this.rooms.get(roomId);
    if (!room) return;

    const { user1, user2 } = room;

    //transferring offers

    if (user1.socket.id === userId) {
      user2.socket.emit("offer", { sdp, roomId });
    } else if (user2.socket.id === userId) {
      user1.socket.emit("offer", { sdp, roomId });
    }
  }

  onAnswer(roomId: string, sdp: string, userId: string) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    const { user1, user2 } = room;

    //transferring answers
    if (user1.socket.id === userId) {
      user2.socket.emit("answer", { sdp, roomId });
    } else if (user2.socket.id === userId) {
      user1.socket.emit("answer", { sdp, roomId });
    }
  }

  onIceCandidates(
    roomId: string,
    senderSocketid: string,
    candidate: any,
    type: "sender" | "receiver"
  ) {
    const room = this.rooms.get(roomId);
    if (!room) {
      return;
    }

    const receivingUser =
      room.user1.socket.id === senderSocketid ? room.user2 : room.user1;
    receivingUser.socket.emit("add-ice-candidate", { candidate, type });
  }
}
