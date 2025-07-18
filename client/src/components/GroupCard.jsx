import '../styles.css'
import { useState, useEffect } from 'react'
import Pill from './Pill'
import CreateStudyGoals from './CreateStudyGoals'
import StudyGoalsModal from './StudyGoalsModal'

// Contains the information for an individual study group
const GroupCard = ({className, dayOfWeek, time, users, groupCompatibilityScore, isCardRecommended, handleUpdateGroupStatus, groupId}) => {
    const [studyGoalsModalIsOpen, setStudyGoalsModalIsOpen] = useState(false);
    const [recommended, setRecommended] = useState();

    const onModalClose = () => {
        setStudyGoalsModalIsOpen(false);
    }

    const handleAcceptGroup = () => {
        handleUpdateGroupStatus(groupId, "accepted");
    }

    const handleRejectGroup = () => {
        handleUpdateGroupStatus(groupId, "rejected");
    }

    useEffect(() => {
        let recommendedStatus = false;
        isCardRecommended(groupId).then((result) => {
            recommendedStatus = result;
        }).then(() => {
            setRecommended(recommendedStatus);
        })
    }, [])

    return (
        <div className={studyGoalsModalIsOpen ? "group-card" : "hover-group-card"}>
            {recommended && <div className="recommended-text">Recommended</div>}
            <h3 className="group-card-title">{className}</h3>
            <div className="group-card-day">{dayOfWeek}</div>
            <div className="group-card-time">{time}</div>
            <h5 className="group-card-users">Members:</h5>
            <div className="group-card-members">
                {users.map((item, index) => {
                    return (
                        <div className="group-card-member" key={index}>{item}</div>
                    )
                })}
            </div>
            {groupCompatibilityScore !== null && <Pill groupScore={groupCompatibilityScore}/>}
            <div className="group-card-buttons">
                <button className="buttons" onClick={handleAcceptGroup}>Accept</button>
                <button className="buttons" onClick={handleRejectGroup}>Reject</button>
            </div>
            <CreateStudyGoals setStudyGoalsModalIsOpen={setStudyGoalsModalIsOpen}/>
            <StudyGoalsModal studyGoalsModalIsOpen={studyGoalsModalIsOpen} onModalClose={onModalClose} className={className}/>
        </div>
    )
}

export default GroupCard;