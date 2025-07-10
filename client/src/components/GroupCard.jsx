import '../styles.css'

const GroupCard = ({className, dayOfWeek, time, users}) => {
    return (
        <div className="group-card">
            <h3 className="group-card-title">{className}</h3>
            <p className="group-card-day">{dayOfWeek}</p>
            <p className="group-card-time">{time}</p>
            <p className="group-card-users">Members: {users}</p>
            <div className="group-card-buttons">
                <button className="buttons">Accept</button>
                <button className="buttons">Reject</button>
            </div>
        </div>
    )
}

export default GroupCard;