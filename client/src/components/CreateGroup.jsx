import '../styles.css'

const CreateGroup = ({setGroupModalIsOpen}) => {
    const handleCreateGroup = () => {
        setGroupModalIsOpen(true);
    }

    return (
        <button className="buttons" id="create-group-button" onClick={handleCreateGroup}>Create a New Group</button>
    )
}

export default CreateGroup;