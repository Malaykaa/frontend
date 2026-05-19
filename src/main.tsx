import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initSentry } from "@/lib/sentry";
import { initTheme } from "@/services/api/profile.api";
import "@/i18n";
import "@/index.css";
import App from "./App";

initSentry();
initTheme();

const root = document.getElementById("root");
if (!root) throw new Error("Root element #root not found");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
