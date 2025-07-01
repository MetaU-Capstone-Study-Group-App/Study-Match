import { useState, useEffect } from "react"
import { useUser } from "./contexts/UserContext";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
    const [formData, setFormData] = useState({username: "", password: "",})
    const [message, setMessage] = useState("")
    const navigate = useNavigate();
    const {user, setUser} = useUser();

    const handleChange = (event) => {
        const {name, value} = event.target

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const fetchData = async (endpoint, method = "GET", headers, credentials = "same-origin", body = null) => {
        try {
            const response = await fetch(`http://localhost:3000/${endpoint}`, {
                method: method,
                headers: headers,
                credentials: credentials,
                body: body,
            });
            if (!response.ok){
                throw new Error('Not able to fetch data.')
            }
            return response;
        }
        catch {
            console.log("Error fetching data.")
        }
    }

    const createPersonalityQuiz = async (dataId) => {
        const newQuizData = {
            id: dataId,
        }
        const newQuiz = await fetchData("quiz/", "POST", {"Content-Type": "application/json"}, "same-origin", JSON.stringify(newQuizData));
    }

    const handleSubmit = async (event) => {
        event.preventDefault(); 
        try {
            const response = await fetchData("auth/signup", "POST", {"Content-Type": "application/json"}, "include", JSON.stringify(formData))
            const data = await response.json()
            if (response.ok) {
                setMessage({type: "success", text: "Signup successful!"})
                setUser(data); 
                createPersonalityQuiz(data.id);
                navigate("/personalityQuiz");
            } else {
                setMessage({type: "error", text: data.error || "Signup failed."})
            }
        } catch (error) {
            setMessage({type: "error", text: "Network error. Please try again."})
        }
    }

    return (
        <div className="signup">
            <div className="navbar">
                <div className="navbar-left">
                    <h1>Study Match</h1>
                </div>
            </div>
            <h2>Sign Up</h2>
            <form className="signup-form" onSubmit={handleSubmit}>
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    className="signup-inputs"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    className="signup-inputs"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                />
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    className="signup-inputs"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                />
                <div className="form-buttons">
                    <button className="buttons" type="submit">Sign Up</button>
                </div>
                {message && (
                    <div className={`message ${message.type}`}>
                        {message.text}
                    </div>
                )}
            </form>
        </div>
    )
}

export default SignupForm