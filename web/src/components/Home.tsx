import { useEffect, useRef, useState } from "react";
import Room from "./Room";

const Home = () => {
  const [joined, setJoined] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startMatching = () => {
    setJoined(true);
  };

  async function getUserMediaStream() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    setLocalStream(stream);
    if (!videoRef.current) return;
    videoRef.current.srcObject = stream;
  }

  useEffect(() => {
    getUserMediaStream();
  }, []);

  if (!joined) {
    return (
      <main className="flex flex-col gap-5 items-center justify-center h-screen bg-black">
        <video ref={videoRef} autoPlay className="w-[40vw] rounded-lg"></video>
        <button
          className="bg-white rounded-md text-black px-2 py-1 "
          onClick={startMatching}
        >
          Join Room
        </button>
      </main>
    );
  }


return <Room localStream={localStream}/>

};
export default Home;
