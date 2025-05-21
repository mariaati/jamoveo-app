import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Signup from './pages/Signup';
import Login from './pages/Login'; 
import AdminPage from './pages/Admin';
import PlayerPage from './pages/Player';
import ResultsPage from './pages/Results';
import LivePage from './pages/Live';








ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/player" element={<PlayerPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/live" element={<LivePage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
