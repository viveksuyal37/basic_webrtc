const Room = ({ localStream }: { localStream: MediaStream | null }) => {

const localAudioTrack = localStream?.getAudioTracks()[0];
const localVideoTrack = localStream?.getVideoTracks()[0];

  return <main className="bg-black text-white h-screen">Room</main>;
};
export default Room;
