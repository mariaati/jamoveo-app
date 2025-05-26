import { io } from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io("https://jamoveo-server-ftf8.onrender.com");


type Song = {
  title: string;
  artist: string;
  lyrics: string;
  chords: string;
};

const PlayerPage = () => {
  const [song, setSong] = useState<Song | null>(null);

  useEffect(() => {
    // נסה לטעון שיר קיים מה-localStorage
    const stored = localStorage.getItem("currentSong");
    if (stored) {
      setSong(JSON.parse(stored));
    }

    // התחברות ל־socket
    console.log("🎧 Player subscribed to receive-song");
    socket.on("receive-song", (data: Song) => {
      console.log("🎵 Player received:", data.title);
      setSong(data);
      localStorage.setItem("currentSong", JSON.stringify(data));
    });

    socket.on("quit-session", () => {
      setSong(null);
      localStorage.removeItem("currentSong");
    });

    return () => {
      socket.off("receive-song");
      socket.off("quit-session");
    };
  }, []);

  return (
    <div className="p-10 min-h-screen bg-gray-100 text-gray-800">
      <h2 className="text-3xl font-bold mb-6">🎤 Player</h2>
      {song ? (
        <div>
          <h3 className="text-2xl font-semibold mb-2">{song.title}</h3>
          <p className="text-xl whitespace-pre-line">{song.lyrics}</p>
        </div>
      ) : (
        <p className="text-xl text-gray-600">Waiting for song...</p>
      )}
    </div>
  );
};

export default PlayerPage;
