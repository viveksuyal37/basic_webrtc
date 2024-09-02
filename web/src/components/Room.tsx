import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const Room = ({ localStream }: { localStream: MediaStream | null }) => {
  const [joined, setJoined] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const socket = io("http://localhost:3002");

  const localAudioTrack = localStream?.getAudioTracks()[0];
  const localVideoTrack = localStream?.getVideoTracks()[0];

  useEffect(() => {
    const pc1 = new RTCPeerConnection(); //sending peer
    const pc2 = new RTCPeerConnection(); //receiving peer

    pc1.onicecandidate = (e) => {
      console.log("sending ice candidates", e.candidate);
      socket.emit("add-ice-candidates", {
        candidate: e.candidate,
        type: "sender",
      });
    };

    pc2.onicecandidate = async (e) => {
      if (!e.candidate) {
        return;
      }
      console.log("ice candidate received on receiving peer", e.candidate);
      if (e.candidate) {
        socket.emit("add-ice-candidates", {
          candidate: e.candidate,
          type: "receiver",
        });
      }
    };

    pc2.ontrack = (e) => {
      console.log("received tracks", e.track);

      console.log(`Track kind: ${e.track.kind}, muted: ${e.track.muted}`);

      if (!videoRef.current) {
        console.log("videoRef is null, returning");
        return;
      }

      if (!videoRef.current.srcObject) {
        videoRef.current.srcObject = new MediaStream();
      }
      //@ts-ignore
      videoRef.current.srcObject.addTrack(e.track);
      videoRef.current.play();
    };

    //upon receiving start message from server send offer to other user
    socket.on("start", async ({ roomId }) => {
      console.log("received roomId", roomId);

      //add tracks to sending peer
      if (localVideoTrack) {
        // console.log(localAudioTrack?.muted,localVideoTrack?.muted)
        pc1.addTrack(localVideoTrack);
      }
      if (localAudioTrack) {
        pc1.addTrack(localAudioTrack);
      }

      //create offer if negotiation is needed
      pc1.onnegotiationneeded = async () => {
        console.log("negotiation needed");
        const sdp = await pc1.createOffer();
        await pc1.setLocalDescription(sdp);
        socket.emit("offer", { sdp: pc1.localDescription, roomId });
      };
    });

    //upon receiving offer from other user send answer to server
    socket.on(
      "offer",
      async ({
        sdp: remoteSdp,
        roomId,
      }: {
        sdp: RTCSessionDescriptionInit;
        roomId: string;
      }) => {
        console.log(" received offer", remoteSdp);
        setJoined(true);

        await pc2.setRemoteDescription(remoteSdp);
        const sdp = await pc2.createAnswer();
        await pc2.setLocalDescription(sdp);
        socket.emit("answer", { sdp: pc2.localDescription, roomId });
      }




    
    );

    //upon receiving answer set remote description
    socket.on(
      "answer",
      async ({ sdp: remoteSdp }: { sdp: RTCSessionDescriptionInit }) => {
        console.log("received answer", remoteSdp);

        await pc1?.setRemoteDescription(remoteSdp);
      }
    );

    socket.on("add-ice-candidates", ({ candidate, type }) => {
      console.log("adding ice candidate from ",type);
      console.log({ candidate, type });
      if (type == "sender") {
        pc2?.addIceCandidate(candidate);
      } else {
        pc1?.addIceCandidate(candidate);
      }
    });




  }, []);

  useEffect(() => {
    if (!localVideoRef.current || !localVideoTrack) return;
    localVideoRef.current.srcObject = new MediaStream([localVideoTrack]);
  }, [localVideoRef]);

  console.log("videoRef", videoRef.current);

  return (
    <main className="relative flex flex-col items-center justify-center h-screen text-white bg-black">
      {!joined && <p>Please wait we are connecting you to the other person</p>}

      <video ref={videoRef} autoPlay className=" w-[60vw] rounded-lg"></video>

      <video
        ref={localVideoRef}
        autoPlay
        className="absolute bottom-10 right-10 w-[10vw] rounded-lg"
      ></video>
    </main>
  );
};
export default Room;
