const baseUrl = () => {
    if (import.meta.env.DEV) {
        return "http://localhost:3000";
    }
    else {
        return (
            import.meta.env.VITE_API_URL || "https://study-match.onrender.com"
        )
    }
}

export default baseUrl;