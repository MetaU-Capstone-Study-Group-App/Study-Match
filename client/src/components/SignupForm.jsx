import { useState, useEffect } from "react"
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import AutocompleteAddress from "./AutocompleteAddress";

// Allows users to create an account
const SignupForm = () => {
    const [formData, setFormData] = useState({})
    const [message, setMessage] = useState("")
    const navigate = useNavigate();
    const {user, setUser} = useUser();
    const [error, setError] = useState("");
    const [goalOptions, setGoalOptions] = useState([]);
    const [selectedGoals, setSelectedGoals] = useState([]);

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
            const data = await response.json();
            return data;
        }
        catch (error) {
            setError("Error. Please try again.");
            return null;
        }
    }

    const createPersonalityQuiz = async (dataId) => {
        const newQuizData = {
            id: dataId,
        }
        const newQuiz = await fetchData("quiz/", "POST", {"Content-Type": "application/json"}, "same-origin", JSON.stringify(newQuizData));
    }

    const createUserGoals = async (userId) => {
        for (const goal of selectedGoals){
            const newGoalData = {
                user_id: userId,
                goal_id: parseInt(goal)
            }
            const newUserGoal = await fetchData("user/goals", "POST", {"Content-Type": "application/json"}, "same-origin", JSON.stringify(newGoalData));
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault(); 
        try {
            const data = await fetchData("auth/signup", "POST", {"Content-Type": "application/json"}, "include", JSON.stringify(formData))
            setMessage({type: "success", text: "Signup successful!"})
            setUser(data); 
            createPersonalityQuiz(data.id);
            createUserGoals(data.id);
            navigate("/personalityQuiz");
        } catch (error) {
            setMessage({type: "error", text: "Network error. Please try again."})
        }
    }

    const addAddressCoordinates = (latitude, longitude) => {
        setFormData((prevState) => ({
            ...prevState,
            ["latitude"]: latitude,
            ["longitude"]: longitude
        }))
    }

    const fetchGoals = async () => {
        const goals = await fetchData("user/goals", "GET");
        setGoalOptions(goals);
    }

    useEffect(() => {
        fetchGoals();
    }, [])

    return (
        <div className="signup">
            <div className="navbar">
                <div className="navbar-left">
                    <h1>Study Match</h1>
                </div>
            </div>
            <h2>Sign Up</h2>
            <form className="signup-form" onSubmit={handleSubmit}>
                <div className="signup-form-top-section">
                    <label htmlFor="name">Full Name</label>
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
                    <label htmlFor="school">College/University</label>
                    <input
                        type="text"
                        className="signup-inputs"
                        id="school"
                        name="school"
                        value={formData.school}
                        onChange={handleChange}
                    />
                    <label htmlFor="class-standing">Class Standing</label>
                    <select name="class_standing" id="class-standing" className="signup-inputs" value={formData.class_standing} onChange={handleChange}>
                        <option disabled selected>Select an option</option>
                        <option value="freshman">Freshman</option>
                        <option value="sophomore">Sophomore</option>
                        <option value="junior">Junior</option>
                        <option value="senior">Senior</option>
                    </select>
                    <label htmlFor="goals">Study Group Goals</label>
                    <select
                        className="signup-inputs"
                        value={selectedGoals}
                        multiple={true}
                        onChange={(e) => {
                            const goals = Array.from(e.target.options);
                            const selectedOptions = goals.filter((goal) => goal.selected).map((goal) => goal.value);
                            setSelectedGoals(selectedOptions);
                        }}
                        required
                    >
                        <option value="" disabled>Select all that apply</option>
                        {goalOptions.map((goal) => (
                            <option value={goal.id} key={goal.id}>{goal.goal}</option> 
                        ))}
                    </select>
                    <label htmlFor="address">Address</label>
                    <AutocompleteAddress addAddressCoordinates={addAddressCoordinates}/>
                </div>
                <div className="signup-form-second-section"><h4>Study Group Preferences</h4>
                    <label htmlFor="preferred-time">Preferred Meeting Hours</label>
                    <div className="signup-time-inputs">
                        <input
                            type="time"
                            className="signup-inputs"
                            id="preferred-start-time"
                            name="preferred_start_time"
                            value={formData.preferred_start_time}
                            onChange={handleChange}
                        />
                        <input
                            type="time"
                            className="signup-inputs"
                            id="preferred-end-time"
                            name="preferred_end_time"
                            value={formData.preferred_end_time}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="form-buttons">
                    <button className="buttons" type="submit">Sign Up</button>
                </div>
                {message && (
                    <div className={`message ${message.type}`}>
                        {message.text}
                    </div>
                )}
                {error && (
                    <p>{error}</p>
                )}
            </form>
        </div>
    )
}

export default SignupForm