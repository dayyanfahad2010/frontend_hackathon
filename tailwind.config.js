/** @type {import('tailwindcss').Config} */
export default {
//   darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#2563EB", hover: "#1D4ED8" },
        bg: "#F8FAFC",
        card: "#FFFFFF",
        ink: { DEFAULT: "#0F172A", secondary: "#475569" },
        border: "#E2E8F0",
        success: "#16A34A",
        warning: "#F59E0B",
        error: "#DC2626",
        sidebar: "#0F172A",
        accent: "#7C3AED",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "12px",
        lg: "8px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(16,24,40,0.06)",
        md: "0 4px 6px -2px rgba(16,24,40,0.08), 0 4px 8px -4px rgba(16,24,40,0.08)",
        lg: "0 10px 15px -3px rgba(16,24,40,0.1)",
      },
    },
  },
  plugins: [],
}