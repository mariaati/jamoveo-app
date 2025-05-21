import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import songs from "../mockSongs.json"; // ⬅ ייבוא ישיר של כל השירים

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
    setResults(songs); // ברירת מחדל – כל השירים
  }
}, []);


  const handleSelectSong = (song: Song) => {
    socket.emit("send-song", song);
    navigate("/live");
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">🎶 All Songs</h2>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((song, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105 p-5 cursor-pointer"
            onClick={() => handleSelectSong(song)}
          >
            <img
              src={song.image || "https://via.placeholder.com/300"}
              alt={song.title}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-900">{song.title}</h3>
            <p className="text-gray-600 mb-2 italic">{song.artist}</p>
            <div className="mt-2 text-sm text-blue-500 font-medium">Click to start live 🎵</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsPage;
