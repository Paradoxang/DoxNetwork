// Fuentes autoalojadas (sin peticiones a Google Fonts): la CSP solo admite 'self'
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "@fontsource/manrope/800.css";
import "./index.css";
import { ViteReactSSG } from "vite-react-ssg";
import { routes } from "./App";

export const createRoot = ViteReactSSG({ routes });
