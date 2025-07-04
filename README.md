# Background Remover App

A modern, AI-powered background removal application built with React, TypeScript, and Express.

## Features

- **Drag & Drop Upload**: Intuitive image upload with drag and drop support
- **Real-time Processing**: AI-powered background removal with processing animations
- **Instant Download**: Download processed images immediately
- **Modern UI**: Beautiful gradient design with smooth animations
- **Responsive**: Works perfectly on all device sizes
- **Type Safe**: Full TypeScript support throughout

## Tech Stack

- **Frontend**: React 18 + TypeScript + TailwindCSS + Radix UI
- **Backend**: Express + Sharp (image processing)
- **API**: Remove.bg integration for real background removal
- **Animations**: Tailwind animations + Lucide icons

## Quick Start

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Set up Remove.bg API** (optional for real background removal):

   - Get your API key from [remove.bg](https://www.remove.bg/api)
   - Set environment variable:
     ```bash
     export REMOVE_BG_API_KEY=your_api_key_here
     ```

3. **Start development server**:

   ```bash
   npm run dev
   ```

4. **Open your browser** to `http://localhost:8080`

## Environment Variables

- `REMOVE_BG_API_KEY` - Your remove.bg API key for real background removal

Without an API key, the app will use a mock processor for demonstration.

## Production Build

```bash
npm run build
npm start
```

## Architecture

- **SPA Frontend**: React Router for client-side routing
- **API Backend**: Express server with image processing endpoints
- **Shared Types**: TypeScript interfaces shared between client and server
- **Modern Styling**: Gradient-based design system with TailwindCSS

## API Endpoints

- `POST /api/remove-background` - Process image and remove background
- `GET /api/ping` - Health check endpoint

## Deployment

The app is ready for deployment on platforms like:

- Netlify (static + serverless functions)
- Vercel
- Railway
- Docker containers

Built with ❤️ using modern web technologies.
