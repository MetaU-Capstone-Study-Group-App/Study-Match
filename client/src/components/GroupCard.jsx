import '../styles.css'
import { useState, useEffect } from 'react'
import Pill from './Pill'
import CreateStudyGoals from './CreateStudyGoals'
import StudyGoalsModal from './StudyGoalsModal'
import MemberCard from './MemberCard'
import Tooltip from './Tooltip'

// Contains the information for an individual study group
const GroupCard = ({className, dayOfWeek, time, users, groupCompatibilityScore, isCardRecommended, handleUpdateGroupStatus, groupId, recommendationsChangedAt, fetchData, existingId, status}) => {
    const [studyGoalsModalIsOpen, setStudyGoalsModalIsOpen] = useState(false);
    const [recommended, setRecommended] = useState();
    const [userInformation, setUserInformation] = useState([]);

    const onModalClose = () => {
        setStudyGoalsModalIsOpen(false);
    }

    const handleAcceptGroup = () => {
        handleUpdateGroupStatus(groupId, "accepted");
    }

    const handleRejectGroup = () => {
        handleUpdateGroupStatus(groupId, "rejected");
    }

    const getUsersInfo = async () => {
        const userInfo = [];
        for (const user of users){
            if (!userInfo[user]){
                userInfo[user] = [];
            }
            const info = await fetchData(`user/info/${user}`, "GET");
            userInfo[user].push(info);
        }
        setUserInformation(userInfo);
    }

    useEffect(() => {
        getUsersInfo();
    }, [])

    useEffect(() => {
        let recommendedStatus = false;
        isCardRecommended(groupId).then((result) => {
            recommendedStatus = result;
        }).then(() => {
            setRecommended(recommendedStatus);
        })
    }, [recommendationsChangedAt])

    return (
        <div className={studyGoalsModalIsOpen ? "group-card" : "hover-group-card"}>
            {recommended && <div className="recommended-text">Recommended</div>}
            <h3 className="group-card-title">{className}</h3>
            <div className="group-card-day">{dayOfWeek}</div>
            <div className="group-card-time">{time}</div>
            <h5 className="group-card-users">Members:</h5>
            <div className="group-card-members">
                {users.map((item, index) => {
                    if (userInformation[item]){
                        return (
                            <MemberCard 
                                key={index} name={userInformation[item][0].name} email={userInformation[item][0].email} phoneNumber={userInformation[item][0].phone_number} profilePicture={userInformation[item][0].profile_picture} fetchData={fetchData} id={userInformation[item][0].id}
                            />
                        )
                    }
                })}
            </div>
            {groupCompatibilityScore !== null && <Pill groupScore={groupCompatibilityScore}/>}
            <div className="group-card-buttons">
                {status === "accepted" ? (
                    <Tooltip text="This group is already accepted.">
                        <button className="buttons" onClick={handleAcceptGroup} id="accept-button" disabled={status === "accepted"}>Accept</button>
                    </Tooltip>
                ) : (
                    <button className="buttons" onClick={handleAcceptGroup} id="accept-button" disabled={status === "accepted"}>Accept</button>
                )}
                {status === "rejected" ? (
                    <Tooltip text="This group is already rejected.">
                        <button className="buttons" onClick={handleRejectGroup} id="reject-button" disabled={status === "rejected"}>Reject</button>
                    </Tooltip>
                ) : (
                    <button className="buttons" onClick={handleRejectGroup} id="reject-button" disabled={status === "rejected"}>Reject</button>
                )}
            </div>
            <CreateStudyGoals setStudyGoalsModalIsOpen={setStudyGoalsModalIsOpen}/>
            <StudyGoalsModal studyGoalsModalIsOpen={studyGoalsModalIsOpen} onModalClose={onModalClose} className={className} fetchData={fetchData} groupId={existingId}/>
        </div>
    )
}

export default GroupCard;