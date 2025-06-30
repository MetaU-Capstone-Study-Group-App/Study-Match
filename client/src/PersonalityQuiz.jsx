import { useState } from "react";
import PersonalityQuestions from './data/PersonalityQuestions'
import './styles.css'
import Footer from "./Footer";

const PersonalityQuiz = () => {
    const [sliderValue, setSliderValue] = useState(1);
    const [currentQuestionDisplayed, setCurrentQuestionDisplayed] = useState(1);

    const handleSliderChange = (event) => {
        setSliderValue(parseInt(event.target.value))
    }

    const handleChangeQuestion = () => {
        setCurrentQuestionDisplayed((prev) => prev + 1);
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
                                <div>
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
            <Footer />
        </div>
    )
}

export default PersonalityQuiz;