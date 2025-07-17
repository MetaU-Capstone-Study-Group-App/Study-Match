import '../styles.css'
import Pill from './Pill'

// Contains the information for an individual study group
const GroupCard = ({className, dayOfWeek, time, users, groupCompatibilityScore, recommended}) => {
    return (
        <div className="group-card">
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
        </div>
    )
}

export default GroupCard;