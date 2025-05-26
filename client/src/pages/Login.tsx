import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import studioBg from "../assets/login.png"; // make sure this is your downloaded background image

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    fetch("https://jamoveo-server-ftf8.onrender.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Login failed");
        return res.json();
      })
      .then((data) => {
        localStorage.setItem("loggedInUser", JSON.stringify({
          username: form.username,
          instrument: data.instrument
        }));
        navigate(data.instrument === "vocals" ? "/player" : "/admin");
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex items-center justify-center"
      style={{ backgroundImage: `url(${studioBg})` }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* Login Box */}
      <div className="relative z-10 w-full max-w-md px-8 py-10 bg-black bg-opacity-70 rounded-2xl shadow-2xl backdrop-blur-sm animate-fade-in">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Welcome back to the jam 🎶
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
          <button
            type="submit"
            className="w-full py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg shadow-md transition-all"
          >
            Log In
          </button>
        </form>

        <p className="text-sm text-gray-300 mt-6 text-center">
          Don’t have an account?{" "}
          <span
            className="text-blue-400 hover:underline cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Create one
          </span>
        </p>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="mt-4 text-sm text-gray-400 hover:text-blue-300 w-full text-center"
        >
          Toggle {darkMode ? "Light" : "Dark"} Mode
        </button>
      </div>
    </div>
  );
};

export default Login;
