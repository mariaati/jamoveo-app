# JaMoveo - Real-Time Music Rehearsal App

JaMoveo is a full-stack web application that enables musicians to collaborate and rehearse songs in real time. The platform provides role-based views for lyrics and chords, a responsive user interface, and real-time synchronization using WebSockets.

## Features

- Login and signup with role selection (admin, vocals, other)
- Live session view with:
  - Auto-scrolling lyrics and chords
  - Role-specific display
  - Quit button for admins only
- Song results page with searchable cards
- Responsive design with modern dark-themed UI
- Real-time sync via WebSockets (Socket.IO)

## Tech Stack

- Frontend: React, TypeScript, Vite
- Styling: TailwindCSS
- Backend: Node.js, Express, Socket.IO
- State: LocalStorage and WebSocket events
- Deployment: Vercel (frontend), Railway/Render (backend optional)

## Getting Started

### 1. Clone the repository

