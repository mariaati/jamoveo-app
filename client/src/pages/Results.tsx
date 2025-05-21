import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import songs from "../mockSongs";
import studioBg from "../assets/login.png"; // use same background image

const socket = io("http://localhost:3001");

type Song = {
  title: string;
  artist: string;
  image?: string;
  lyrics: string;
  chords: string;
};

const ResultsPage = () => {
  const [results, setResults] = useState<Song[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("searchResults");
    if (stored) {
      setResults(JSON.parse(stored));
    } else {
      setResults(songs);
    }
  }, []);

  const handleSelectSong = (song: Song) => {
    socket.emit("send-song", song);
    localStorage.setItem("currentSong", JSON.stringify(song));
    navigate("/live");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative px-6 py-12 flex flex-col items-center"
      style={{ backgroundImage: `url(${studioBg})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-0" />

      <h2 className="relative z-10 text-4xl font-bold text-white text-center mb-10 animate-fade-in">
        🎵 Choose a Song to Go Live
      </h2>

      <div className="relative z-10 grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl">
        {results.map((song, index) => (
          <div
            key={index}
            onClick={() => handleSelectSong(song)}
            className="bg-gray-900 bg-opacity-80 text-white rounded-2xl shadow-xl hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden animate-fade-in"
          >
            <img
              src={song.image || "https://via.placeholder.com/300x200"}
              alt={song.title}
              className="w-full h-52 object-cover"
            />
            <div className="p-5">
              <h3 className="text-xl font-semibold">{song.title}</h3>
              <p className="text-sm italic text-gray-400">{song.artist}</p>
              <p className="mt-4 text-blue-400 text-sm font-medium">Click to start live 🎤</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsPage;
