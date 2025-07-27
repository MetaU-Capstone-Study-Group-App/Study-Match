const baseUrl = import.meta.env.DEV ? "http://localhost:3000" : import.meta.env.VITE_API_URL || "https://study-match.onrender.com";

export default baseUrl;