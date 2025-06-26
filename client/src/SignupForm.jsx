import { useState } from "react"
import { useUser } from "./contexts/UserContext";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
    const [formData, setFormData] = useState({username: "", password: "",})
    const [message, setMessage] = useState("")
    const {setUser} = useUser();
    const navigate = useNavigate();

    const handleChange = (event) => {
        const {name, value} = event.target

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault(); 

        try {
            const response = await fetch("http://localhost:3000/auth/signup", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData),
                credentials: "include",
            })

            const data = await response.json()

            if (response.ok) {
                setMessage({type: "success", text: "Signup successful!"})
                setUser(data); 
                navigate("/");
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