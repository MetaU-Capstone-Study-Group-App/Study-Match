import GroupCard from './GroupCard'
import '../styles.css'
import WeekDays from '../data/WeekDays'
import { useEffect, useState } from 'react'

const GroupList = ({data, user, existingGroups, getClassName, getUserName}) => {
    const GENERIC_DATE = `2025-07-01T`;
    const [userExistingGroups, setUserExistingGroups] = useState([]);

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

    useEffect(() => {
        setUserExistingGroups(data);
    }, [data])

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
                                const userNames = getUserName(obj.user_id);
                                return (
                                    <GroupCard key={obj.id} className={className} dayOfWeek={dayOfWeek} time={time} users={userNames}/>
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