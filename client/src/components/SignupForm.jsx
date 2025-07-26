import { useState, useEffect } from "react"
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import AutocompleteAddress from "./AutocompleteAddress";
import 'react-phone-number-input/style.css'
import '../styles.css'
import Tooltip from "./Tooltip";
import EmptyNavBar from "./EmptyNavBar";
import LoadingIndicator from "./LoadingIndicator";

// Allows users to create an account
const SignupForm = () => {
    const [formData, setFormData] = useState({})
    const [message, setMessage] = useState("")
    const navigate = useNavigate();
    const {user, setUser} = useUser();
    const [error, setError] = useState("");
    const [goalOptions, setGoalOptions] = useState([]);
    const [selectedGoals, setSelectedGoals] = useState([]);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isLoading, setIsLoading] = useState(false);

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
            const data = await response.json();
            if (!response.ok){
                throw new Error(data.error || 'Not able to fetch data.')
            }
            return data;
        }
        catch (error) {
            setError(error.message);
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
        setIsLoading(true); 
        try {
            const data = await fetchData("auth/signup", "POST", {"Content-Type": "application/json"}, "include", JSON.stringify(formData))
            setMessage({type: "success", text: "Signup successful!"})
            setUser(data); 
            createPersonalityQuiz(data.id);
            createUserGoals(data.id);
            setIsLoading(false);
            navigate("/personalityQuiz");
        } catch (error) {
            setIsLoading(false);
            setMessage({type: "error", text: "Error. Please try again."})
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
            <EmptyNavBar />
            <h2>Sign Up</h2>
            <form className="signup-form" onSubmit={handleSubmit}>
                <div className="signup-form-top-section">
                    <div className="signup-form-row">
                        <label htmlFor="name">Full Name
                            <input
                                type="text"
                                className="signup-inputs"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label htmlFor="username">Username
                            <input
                                type="text"
                                className="signup-inputs"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label htmlFor="password">Password
                            <input
                                type="password"
                                className="signup-inputs"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </label>
                    </div>
                    <div className="signup-form-row">
                        <label htmlFor="email">Email Address
                            <input
                                type="email"
                                className="signup-inputs"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label htmlFor="phone_number">Phone Number
                            <input
                                type="tel"
                                className="signup-inputs"
                                id="phone_number"
                                name="phone_number"
                                value={formData.phone_number}
                                pattern="[0-9]{10}"
                                maxLength="10"
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label htmlFor="school">College/University
                            <input
                                type="text"
                                className="signup-inputs"
                                id="school"
                                name="school"
                                value={formData.school}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <div className="signup-form-row">
                        <label htmlFor="class-standing">Class Standing
                            <select name="class_standing" id="class-standing" className="signup-inputs" value={formData.class_standing} onChange={handleChange}>
                                <option disabled selected>Select an option</option>
                                <option value="freshman">Freshman</option>
                                <option value="sophomore">Sophomore</option>
                                <option value="junior">Junior</option>
                                <option value="senior">Senior</option>
                            </select>
                        </label>
                        <div>
                            <section id="study-goals-header">
                                <label htmlFor="goals" id="study-goals-label">Study Goals</label>
                                <Tooltip text="Press the Command or Control key to select multiple goals.">
                                    <button className="buttons" id="info-button">i</button>
                                </Tooltip>
                            </section>
                            <select
                                className="signup-inputs"
                                value={selectedGoals}
                                multiple={true}
                                onChange={(e) => {
                                    const goals = Array.from(e.target.options);
                                    const selectedOptions = goals.filter((goal) => goal.selected).map((goal) => goal.value);
                                    setSelectedGoals(selectedOptions);
                                }}
                            >
                                <option value="" disabled>Select all that apply</option>
                                {goalOptions.map((goal) => (
                                    <option value={goal.id} key={goal.id}>{goal.goal}</option> 
                                ))}
                            </select>
                        </div>
                        <label htmlFor="address">Address
                            <AutocompleteAddress addAddressCoordinates={addAddressCoordinates}/>
                        </label>
                    </div>
                </div>
                <div className="signup-form-second-section"><h4>Compatibility Score Weights</h4>
                    <label htmlFor="score-weights">Please input the weight for each variable, with decimals closer to 1 indicating higher importance. All five weights must add up to 1.</label>
                    <div className="signup-weight-inputs">
                        <div className="signup-weight-input">
                            <label htmlFor="personality_weight">Personality Weight
                                <input
                                    type="number"
                                    min="0.00"
                                    step="0.01"
                                    className="signup-inputs"
                                    id="personality_weight"
                                    name="personality_weight"
                                    value={formData.personality_weight}
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                        <div className="signup-weight-input">
                            <label htmlFor="location_weight">Location Weight
                                <input
                                    type="number"
                                    min="0.00"
                                    step="0.01"
                                    className="signup-inputs"
                                    id="location_weight"
                                    name="location_weight"
                                    value={formData.location_weight}
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                        <div className="signup-weight-input">
                            <label htmlFor="goals_weight">Goals Weight
                                <input
                                    type="number"
                                    min="0.00"
                                    step="0.01"
                                    className="signup-inputs"
                                    id="goals_weight"
                                    name="goals_weight"
                                    value={formData.goals_weight}
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                        <div className="signup-weight-input">
                            <label htmlFor="school_weight">School Weight
                                <input
                                    type="number"
                                    min="0.00"
                                    step="0.01"
                                    className="signup-inputs"
                                    id="school_weight"
                                    name="school_weight"
                                    value={formData.school_weight}
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                        <div className="signup-weight-input">
                            <label htmlFor="class_standing_weight">Class Standing Weight
                                <input
                                    type="number"
                                    min="0.00"
                                    step="0.01"
                                    className="signup-inputs"
                                    id="class_standing_weight"
                                    name="class_standing_weight"
                                    value={formData.class_standing_weight}
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                    </div>
                </div>
                <div className="signup-form-third-section"><h4>Study Group Preferences</h4>
                    <label htmlFor="preferred-time">Preferred Meeting Hours</label>
                    <div className="signup-time-inputs">
                        <div className="signup-time-input">
                            <label>Preferred Start Time</label>
                            <input
                                type="time"
                                className="signup-inputs"
                                id="preferred-start-time"
                                name="preferred_start_time"
                                value={formData.preferred_start_time}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="signup-time-input">
                            <label>Preferred End Time</label>
                            <input
                                type="time"
                                className="signup-inputs"
                                id="preferred-end-time"
                                name="preferred_end_time"
                                value={formData.preferred_end_time}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </div>
                <div className="form-buttons">
                    <button className="buttons" type="submit">Sign Up</button>
                </div>
                <div className="loading-section">
                    {isLoading &&
                        <LoadingIndicator loading={isLoading} className="loading-spinner"/>
                    }
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