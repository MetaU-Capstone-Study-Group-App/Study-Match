import GroupCard from './GroupCard'
import '../styles.css'
import WeekDays from '../data/WeekDays'
import { useEffect, useState } from 'react'
import CompatibilityScore from '../utils/CompatibilityScore'

// Displays all of a user's study groups in a grid format
const GroupList = ({data, user, existingGroups, getClassName, getUserName, fetchData}) => {
    const GENERIC_DATE = `2025-07-01T`;
    const [userExistingGroups, setUserExistingGroups] = useState([]);
    const [groupScores, setGroupScores] = useState(0);

    const getExistingGroupInfo = (groupId) => {
        for (const group of existingGroups){
            const startTime = new Date(`${GENERIC_DATE}${group.start_time}`);
            const formattedStart = startTime.toLocaleTimeString('en-US', {hour: 'numeric', minute:'2-digit', hour12: true});
            const endTime = new Date(`${GENERIC_DATE}${group.end_time}`);
            const formattedEnd = endTime.toLocaleTimeString('en-US', {hour: 'numeric', minute:'2-digit', hour12: true});
            if (group.id == groupId){
                return {class_id: group.class_id, day_of_week: group.day_of_week, start_time: formattedStart, end_time: formattedEnd}
            }
        }
    }

    const getGroupMembers = (groupId) => {
        const groupMembers = [];
        for (const group of userExistingGroups){
            if (group.existing_group_id === groupId){
                groupMembers.push(group.user_id)
            }
        }
        return groupMembers;
    }

    const calculateGroupCompatibilityScore = (compatibilityScores) => {
        let totalScore = 0;
        for (const score of compatibilityScores){
            totalScore += parseFloat(score);
        }
        return totalScore / compatibilityScores.length;
    }

    const calculateAllGroupScores = async () => {
        const compatibilityScorePromises = [];
        const compatibilityScores = {};
        const existingGroupIds = [...new Set(userExistingGroups.map((obj) => obj.existing_group_id))];
        for (const groupId of existingGroupIds){
            compatibilityScorePromises.length = 0;
            const groupMembers = getGroupMembers(groupId);
            for (const member of groupMembers){
                if (member !== user.id && groupMembers.length > 1){
                    compatibilityScorePromises.push(CompatibilityScore(user.id, member, fetchData));
                }
                else if (groupMembers.length === 1){
                    compatibilityScorePromises.push(1);
                }
            }
            const finalScores = await Promise.all(compatibilityScorePromises);
            compatibilityScores[groupId] = calculateGroupCompatibilityScore(finalScores).toFixed(2);
        }
        setGroupScores(compatibilityScores);
    }

    useEffect(() => {
        setUserExistingGroups(data);
    }, [data])

    useEffect(() => {
        if (user){
            calculateAllGroupScores();
        }
    }, [userExistingGroups, user])

    if (!data || !user){
        return (
            <div>Loading...</div>
        )
    }

    return (
        <main>
            <div className="group-list-container">
                {
                    userExistingGroups.map(obj => {
                        if (user) {
                            if (obj.user_id == user.id){
                                const groupInfo = getExistingGroupInfo(obj.existing_group_id);
                                const className = getClassName(groupInfo.class_id);
                                const dayOfWeek = Object.keys(WeekDays)[groupInfo.day_of_week - 1];
                                const time = groupInfo.start_time + " - " + groupInfo.end_time;
                                const groupMembers = getGroupMembers(obj.existing_group_id)
                                let userNames = []
                                for (const member of groupMembers){
                                    userNames.push(getUserName(member))
                                }
                                const groupScore = groupScores[obj.existing_group_id] ? groupScores[obj.existing_group_id] : null;
                                return (
                                    <GroupCard key={obj.id} className={className} dayOfWeek={dayOfWeek} time={time} users={userNames} groupCompatibilityScore={groupScore}/>
                                )
                            }
                        }
                    })
                }
            </div>
        </main>
    )
}

export default GroupList;