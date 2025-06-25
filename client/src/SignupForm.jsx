import { useState } from "react"

const SignupForm = () => {
    const [formData, setFormData] = useState({ username: "", password: "", })
    const [message, setMessage] = useState("")

    const handleChange = (event) => {
        const { name, value } = event.target

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault(); 
        console.log("User Input:", formData); 

        try {
            const response = await fetch("http://localhost:3000/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (response.ok) {
                setMessage({ type: "success", text: "Signup successful!" })
            } else {
                setMessage({ type: "error", text: data.error || "Signup failed." })
            }
        } catch (error) {
            setMessage({ type: "error", text: "Network error. Please try again." })
        }
    }

    return (
        <form className="signup-form" onSubmit={handleSubmit}>
            <label htmlFor="name">Name</label>
            <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
            />
            <label htmlFor="username">Username</label>
            <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
            />
            <label htmlFor="password">Password</label>
            <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
            />
            <div className="form-buttons">
                <button type="submit">Sign Up</button>
            </div>
            {message && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}
        </form>
    )
}

export default SignupForm