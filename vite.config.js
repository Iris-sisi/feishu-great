import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api":
        "https://api.apiusb.com/api/app?service=App.NumbersFormula.RandomNumberGenerator&num=8&min=7&max=15",
    },
  },
});
