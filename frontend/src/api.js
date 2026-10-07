// Single place for the backend URL.
// Local:  frontend/.env       -> VITE_API_URL=http://localhost:3000
// Vercel: Project Settings -> Environment Variables -> VITE_API_URL=https://<your-backend>.vercel.app
const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/+$/, "");
export default API_URL;
