import { useState } from "react";

const StudyGoalsModal = ({studyGoalsModalIsOpen, onModalClose}) => {
    const [inputValue, setInputValue] = useState("");

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
        event.preventDefault();
        setInputValue("");
        onModalClose();
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
            </div>
        </div>
    );
}

export default StudyGoalsModal;