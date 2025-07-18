import '../styles.css'
import { useState } from 'react'
import Pill from './Pill'
import CreateStudyGoals from './CreateStudyGoals'
import StudyGoalsModal from './StudyGoalsModal'

// Contains the information for an individual study group
const GroupCard = ({className, dayOfWeek, time, users, groupCompatibilityScore, recommended}) => {
    const [studyGoalsModalIsOpen, setStudyGoalsModalIsOpen] = useState(false);

    const onModalClose = () => {
        setStudyGoalsModalIsOpen(false);
    }

    return (
        <div className={studyGoalsModalIsOpen ? "group-card" : "hover-group-card"}>
            {recommended && <div className="recommended-text">Recommended</div>}
            <h3 className="group-card-title">{className}</h3>
            <p className="group-card-day">{dayOfWeek}</p>
            <p className="group-card-time">{time}</p>
            <h5 className="group-card-users">Members:</h5>
            <div className="group-card-members">
                {users.map((item, index) => {
                    return (
                        <p className="group-card-member" key={index}>{item}</p>
                    )
                })}
            </div>
            {groupCompatibilityScore !== null && <Pill groupScore={groupCompatibilityScore}/>}
            <div className="group-card-buttons">
                <button className="buttons">Accept</button>
                <button className="buttons">Reject</button>
            </div>
            <CreateStudyGoals setStudyGoalsModalIsOpen={setStudyGoalsModalIsOpen}/>
            <StudyGoalsModal studyGoalsModalIsOpen={studyGoalsModalIsOpen} onModalClose={onModalClose}/>
        </div>
    )
}

export default GroupCard;