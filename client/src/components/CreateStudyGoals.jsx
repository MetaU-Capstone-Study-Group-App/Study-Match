import '../styles.css'

// Opens the study goals modal when clicked
const CreateStudyGoals = ({setStudyGoalsModalIsOpen}) => {
    const handleCreateStudyGoals = () => {
        setStudyGoalsModalIsOpen(true);
    }

    return (
        <button className="buttons" id="study-goals-button" onClick={handleCreateStudyGoals}>Generate Study Goals</button>
    )
}

export default CreateStudyGoals;