import { useState } from "react";
import PersonalityQuestions from '../data/PersonalityQuestions'
import '../styles.css'
import Footer from "./Footer";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

// Quiz with 10 questions relating to Big Five Personality traits and a slider from 1-5 as the response for each question
const PersonalityQuiz = () => {
    const {user, setUser} = useUser();
    const [sliderValue, setSliderValue] = useState(1);
    const [currentQuestionDisplayed, setCurrentQuestionDisplayed] = useState(1);
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const fetchData = async (endpoint, method = "GET", headers, credentials = "include", body = null) => {
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
        catch (error) {
            setError("Error. Please try again.");
            return null;
        }
    }

    const storeQuizResponse = async () => {
        let currentObject = null;
        PersonalityQuestions.map(obj => {
            if (obj.id === currentQuestionDisplayed){
                currentObject = obj;
            }
        })
        const newResponseData = {
            user_id: user.id,
            question_id: currentObject.id,
            question: currentObject.question,
            question_trait: currentObject.trait,
            response: sliderValue
        }
        const newResponse = await fetchData("quiz/responses/", "POST", {"Content-Type": "application/json"}, "include", JSON.stringify(newResponseData));
        if (currentObject.id >= PersonalityQuestions.length){
            navigate('/calendar');
        }
    }

    const handleSliderChange = (event) => {
        setSliderValue(parseInt(event.target.value))
    }

    const handleChangeQuestion = () => {
        storeQuizResponse();
        setCurrentQuestionDisplayed((prev) => prev + 1);
        setSliderValue(1);
    }

    return (
        <div className="personality-quiz-container">
            <div className="navbar">
                <div className="navbar-left">
                    <h1>Study Match</h1>
                </div>
            </div>
            <div className="page-header">Personality Quiz</div>
            <div className="personality-quiz-form">
                <h3>For the following questions, please rate the accuracy of each statement on a scale from 1 to 5, where 1 represents "Very Inaccurate" and 5 represents "Very Accurate".</h3>
                <p>I commonly...</p>
                {
                    PersonalityQuestions.map(obj => {
                        if (obj.id === currentQuestionDisplayed){
                            return (
                                <div key={obj.id}>
                                    {obj.question}
                                </div>
                            )
                        }
                    })
                }
                <div className="slider">
                    <input type="range" min="1" max="5" step="1" value={sliderValue} onChange={handleSliderChange}/>
                    <h3>{sliderValue}</h3>
                </div>
                <button className="buttons" id="personality-quiz-button" onClick={handleChangeQuestion}>Next Question</button>
            </div>
            {error && (
                <p>{error}</p>
            )}
            <Footer />
        </div>
    )
}

export default PersonalityQuiz;