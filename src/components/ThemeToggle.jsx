import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { IconButton } from "./ui/Button";

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => localStorage.getItem("darkMode") === "true");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("darkMode", dark);
  }, [dark]);

  return (
    <IconButton
      size="sm"
      label={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setDark((d) => !d)}
    >
      {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </IconButton>
  );
}
