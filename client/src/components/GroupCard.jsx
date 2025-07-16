import '../styles.css'

// Contains the information for an individual study group
const GroupCard = ({className, dayOfWeek, time, users, groupCompatibilityScore}) => {
    return (
        <div className="group-card">
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
            <p className="group-compatibility">Group Compatibility Score: {groupCompatibilityScore}</p>
            <div className="group-card-buttons">
                <button className="buttons">Accept</button>
                <button className="buttons">Reject</button>
            </div>
        </div>
    )
}

export default GroupCard;