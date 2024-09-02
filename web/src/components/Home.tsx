import { useEffect, useRef, useState } from "react";
import Room from "./Room";

const Home = () => {
  const [isIdle, setIsIdle] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startMatching = () => {
    setIsIdle(true);
  };

  async function getUserMediaStream() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    setLocalStream(stream);
    if (!videoRef.current) return;
    videoRef.current.srcObject = new MediaStream([stream.getVideoTracks()[0]]);
  }

  useEffect(() => {
    getUserMediaStream();
  }, []);

  if (!isIdle) {
    return (
      <main className="flex flex-col items-center justify-center h-screen gap-5 bg-black">
        <video ref={videoRef} autoPlay className="w-[40vw] rounded-lg"></video>
        <button
          className="px-2 py-1 text-black bg-white rounded-md "
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
