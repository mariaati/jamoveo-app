import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import studioBg from "../assets/login.png";

const socket = io("http://localhost:3001");

type Song = {
  title: string;
  artist: string;
  image?: string;
  lyrics: string;
  chords: string;
};

const LivePage = () => {
  const [song, setSong] = useState<Song | null>(null);
  const [role, setRole] = useState<"admin" | "vocals" | "other">("other");
  const [scrolling, setScrolling] = useState(false);
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
    const currentSong = JSON.parse(localStorage.getItem("currentSong") || "null");

    if (user.instrument === "admin") setRole("admin");
    else if (user.instrument === "vocals") setRole("vocals");
    else setRole("other");

    if (currentSong) setSong(currentSong);

    socket.on("receive-song", (newSong: Song) => {
      setSong(newSong);
      localStorage.setItem("currentSong", JSON.stringify(newSong));
    });

    return () => {
      socket.off("receive-song");
    };
  }, []);

  useEffect(() => {
    if (scrolling && scrollRef.current) {
      const interval = setInterval(() => {
        scrollRef.current?.scrollBy({ top: 1, behavior: "smooth" });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [scrolling]);

  const handleQuit = () => {
    localStorage.removeItem("currentSong");
    navigate("/results");
  };

  const getContent = () => {
    if (!song) return "No song selected";

    if (role === "vocals") return song.lyrics;
    if (role === "admin") return `${song.lyrics}\n\n---\n\n${song.chords}`;
    return song.chords;
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex items-center justify-center p-6"
      style={{ backgroundImage: `url(${studioBg})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-4xl bg-black bg-opacity-80 text-white p-8 rounded-2xl shadow-2xl animate-fade-in">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">{song?.title}</h2>
            <p className="text-sm text-gray-400 italic">{song?.artist}</p>
          </div>
          {role === "admin" && (
            <button
              onClick={handleQuit}
              className="mt-4 md:mt-0 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-semibold transition"
            >
              Quit Session
            </button>
          )}
        </div>

        <div className="mb-4 flex justify-end">
          <button
            onClick={() => setScrolling(!scrolling)}
            className="text-sm bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition"
          >
            {scrolling ? "Stop Scroll" : "Auto Scroll"}
          </button>
        </div>

        <div
          ref={scrollRef}
          className="h-[60vh] overflow-y-auto whitespace-pre-wrap text-lg leading-relaxed scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 border border-gray-700 p-4 rounded-lg bg-gray-900 bg-opacity-60"
        >
          {getContent()}
        </div>
      </div>
    </div>
  );
};

export default LivePage;
