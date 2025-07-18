import { useState } from "react";
import GoalsGenerator from "./GoalsGenerator";
import LoadingIndicator from "./LoadingIndicator";
import ReactMarkdown from "react-markdown";

const StudyGoalsModal = ({studyGoalsModalIsOpen, onModalClose, className}) => {
    const [inputValue, setInputValue] = useState("");
    const [mainStudyGoals, setMainStudyGoals] = useState("");
    const [loading, setLoading] = useState(false);

    if (!studyGoalsModalIsOpen){
        return null;
    }

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    }

    const handleModalClose = () => {
        onModalClose();
    }

    const handleNewGoalsSubmit = async (event) => {
        setLoading(true);
        event.preventDefault();
        setInputValue("");
        const mainGoals = await GoalsGenerator(className, inputValue);
        setMainStudyGoals(mainGoals);
        setLoading(false);
    }

    return (
        <div className="new-group-modal">
            <div className="new-goals-modal-content">
                <div className="new-group-modal-close-button">
                    <span className="close" onClick={handleModalClose}>&times;</span>
                </div>
                <h3>Generate Study Goals For Your Group</h3>
                <form onSubmit={handleNewGoalsSubmit} className="new-group-modal-form">
                    <label htmlFor="resources-input">Input class resources here:</label>
                    <input type="text" value={inputValue} onChange={handleInputChange}></input>
                    <div className="new-group-modal-buttons">
                        <button type="submit" className="new-group-modal-submit">Submit</button>
                    </div>
                </form>
                <div className="study-goals-section">
                    <h4>Main Study Goals:</h4>
                    {
                        !loading && mainStudyGoals === "" && 
                        <div>
                            <div>There are no available study goals for this group yet.</div>
                            <div>Please input class resources like notes, syllabi, flashcards, etc.</div>
                        </div>
                    }
                    {loading && 
                        <LoadingIndicator loading={loading} />
                    }
                    <div className="generated-study-goals">
                        <ReactMarkdown>{mainStudyGoals}</ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudyGoalsModal;