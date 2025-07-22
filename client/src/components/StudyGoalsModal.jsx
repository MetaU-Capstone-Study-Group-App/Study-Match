import { useState, useEffect } from "react";
import GoalsGenerator from "./GoalsGenerator";
import LoadingIndicator from "./LoadingIndicator";
import ReactMarkdown from "react-markdown";

// Generates five main study goals for the group using Gemini API and resources inputted by the group members
const StudyGoalsModal = ({studyGoalsModalIsOpen, onModalClose, className, fetchData, groupId}) => {
    const [inputValue, setInputValue] = useState("");
    const [mainStudyGoals, setMainStudyGoals] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (studyGoalsModalIsOpen){
            displayStudyGoals();
        }
    }, [studyGoalsModalIsOpen])

    if (!studyGoalsModalIsOpen){
        return null;
    }

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    }

    const handleModalClose = () => {
        onModalClose();
    }

    // Generates main study goals using class name, resources inputted by the user, and previous goals generated for the group (if any)
    const handleNewGoalsSubmit = async (event) => {
        setLoading(true);
        event.preventDefault();
        setInputValue("");
        let mainGoals = "";
        const existingStudyGoals = await fetchData(`group/existingGroup/${groupId}/`, "GET");
        mainGoals = await GoalsGenerator(className, inputValue, existingStudyGoals);
        const newStudyGoals = {
            study_goals: mainGoals
        }
        const savedStudyGoals = await fetchData(`group/existingGroup/${groupId}/`, "PUT", {"Content-Type": "application/json"}, "include", JSON.stringify(newStudyGoals));
        setMainStudyGoals(savedStudyGoals);
        setLoading(false);
    }

    // Displays the 5 main study goals generated for the group
    const displayStudyGoals = async () => {
        const existingStudyGoals = await fetchData(`group/existingGroup/${groupId}/`, "GET");
        if (!existingStudyGoals){
            return;
        }
        setMainStudyGoals(existingStudyGoals);
    }

    return (
        <div className="new-group-modal">
            <div className="new-goals-modal-content">
                <div className="new-group-modal-close-button">
                    <span className="close" onClick={handleModalClose}>&times;</span>
                </div>
                <h3>Generate Study Goals for {className}</h3>
                <form onSubmit={handleNewGoalsSubmit} className="new-group-modal-form">
                    <label htmlFor="resources-input">Input Class Resources:</label>
                    <textarea value={inputValue} rows={5} onChange={handleInputChange} placeholder="Please input class resources like notes, syllabi, flashcards, etc."></textarea>
                    <div className="new-group-modal-buttons">
                        <button type="submit" className="new-group-modal-submit">Submit</button>
                    </div>
                </form>
                <div className="study-goals-section">
                    <h4>Main Study Goals:</h4>
                    {
                        !loading && mainStudyGoals === "" && 
                        <div>There are no available study goals for this group yet.</div>
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