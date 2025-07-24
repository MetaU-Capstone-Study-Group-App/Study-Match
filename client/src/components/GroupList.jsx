import GroupCard from './GroupCard'
import '../styles.css'
import WeekDays from '../data/WeekDays'
import { useEffect, useState } from 'react'
import CompatibilityScore from '../utils/CompatibilityScore'
import LoadingIndicator from './LoadingIndicator'

// Displays all of a user's study groups in a grid format
const GroupList = ({data, user, existingGroups, getClassName, getUserName, fetchData, handleUpdateGroupStatus, currentStatus, scoreWeights}) => {
    const GENERIC_DATE = `2025-07-01T`;
    const [userExistingGroups, setUserExistingGroups] = useState([]);
    const [groupScores, setGroupScores] = useState({});
    const [statusGroups, setStatusGroups] = useState([]);
    const groupsByStatus = [];
    const [recommendationsChangedAt, setRecommendationsChangedAt] = useState(Date.now());
    const POSSIBLE_STATUS = ["available", "accepted", "rejected"];
    const [isLoading, setIsLoading] = useState(true);
    const [wasFavorited, setWasFavorited] = useState(false);

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
            if (group.existing_group_id === groupId && (group.status === POSSIBLE_STATUS[1] || group.user_id === user.id)){
                groupMembers.push(group.user_id)
            }
        }
        return groupMembers;
    }

    // Calculates the average of all individual compatibility scores between users in a specific group
    const calculateGroupCompatibilityScore = (compatibilityScores) => {
        let totalScore = 0;
        for (const score of compatibilityScores){
            totalScore += parseFloat(score);
        }
        return totalScore / compatibilityScores.length;
    }

    // Calculates compatibility scores between the user and all other group members
    const calculateAllGroupScores = async () => {
        setIsLoading(true);
        const compatibilityScorePromises = [];
        const compatibilityScores = {};
        const existingGroupIds = [...new Set(userExistingGroups.map((obj) => obj.existing_group_id))];
        for (const groupId of existingGroupIds){
            compatibilityScorePromises.length = 0;
            const groupMembers = getGroupMembers(groupId);
            for (const member of groupMembers){
                if (member !== user.id && groupMembers.length > 1){
                    compatibilityScorePromises.push(CompatibilityScore(user.id, member, fetchData, scoreWeights));
                }
                else if (groupMembers.length === 1){
                    compatibilityScorePromises.push(1);
                }
            }
            const finalScores = await Promise.all(compatibilityScorePromises);
            compatibilityScores[groupId] = calculateGroupCompatibilityScore(finalScores).toFixed(2);
        }
        setGroupScores(compatibilityScores);
        setIsLoading(false);
    }

    // Separates groups into available, accepted, and rejected
    const groupByStatus = async () => {
        const filteredUserGroups = userExistingGroups.filter((obj) => obj.user_id == user.id);
        for (const group of filteredUserGroups){
            if (!groupsByStatus[group.status]){
                groupsByStatus[group.status] = [];
            }
            groupsByStatus[group.status].push(group);
        }
        for (const status of POSSIBLE_STATUS){
            groupsByStatus[status]?.sort((a,b) => {
                return groupScores[b.existing_group_id] - groupScores[a.existing_group_id];
            })
        }
        setStatusGroups(groupsByStatus);
    }

    const handleRecommend = async (groupId, recommendStatus) => {
        const recommendedGroup = await fetchData(`group/userExistingGroup/recommend/${groupId}/`, "PUT", {"Content-Type": "application/json"}, "include", JSON.stringify({recommend_status: recommendStatus}));
        setRecommendationsChangedAt(Date.now());
    }

    const sortUserGroups = () => {
        if (Object.keys(groupScores).length > 0){
            const sortedUserGroups = userExistingGroups.sort((a,b) => {
                return groupScores[b.existing_group_id] - groupScores[a.existing_group_id];
            })
            setUserExistingGroups(sortedUserGroups);
            return sortedUserGroups;
        }
    }

    // Recommends the group with the highest group compatibility score for each class
    const recommendGroups = async () => {
        const previousClasses = [];
        if (userExistingGroups.length !== 0){
            const sortedUserGroups = sortUserGroups();
            sortedUserGroups?.map((obj) => {
                if (user) {
                    if (obj.user_id == user.id){
                        const groupInfo = getExistingGroupInfo(obj.existing_group_id);
                        const className = getClassName(groupInfo.class_id);
                        if (!previousClasses.includes(className)){
                            handleRecommend(obj.id, true);
                            previousClasses.push(className);
                        }
                        else {
                            handleRecommend(obj.id, false);
                        }
                    }
                }
            }) 
        }
    }

    const isCardRecommended = async (objId) => {
        const isRecommended = await fetchData(`group/userExistingGroup/recommend/${objId}/`, "GET");
        return isRecommended;
    }

    const handleFavorited = () => {
        setWasFavorited(prev => !prev);
    }

    useEffect(() => {
        setUserExistingGroups(data);
    }, [data])

    const loadGroupScores = async () => {
        if (user){
            await calculateAllGroupScores();
        }
    }

    const loadGroupsByStatus = async () => {
        await groupByStatus();
    }

    useEffect(() => {
        loadGroupScores();
    }, [userExistingGroups, user, wasFavorited])

    useEffect(() => {
        loadGroupsByStatus();
    }, [groupScores, currentStatus])

    useEffect(() => {
        recommendGroups();
    }, [statusGroups])

    if (!data || !user){
        return (
            <LoadingIndicator loading={isLoading} className="loading-spinner"/>
        )
    }

    // Renders the Group Card for an individual study group
    const displayGroupCard = (obj) => {
        if (user) {
            if (obj.user_id == user.id){
                const groupInfo = getExistingGroupInfo(obj.existing_group_id);
                const className = getClassName(groupInfo.class_id);
                const dayOfWeek = Object.keys(WeekDays)[groupInfo.day_of_week - 1];
                const time = groupInfo.start_time + " - " + groupInfo.end_time;
                const groupMembers = getGroupMembers(obj.existing_group_id)
                let userNames = []
                memberLoop: for (const member of groupMembers){
                    for (const g of userExistingGroups){
                        if (g.status === "rejected" && member === g.user_id && obj.existing_group_id === g.existing_group_id){
                            continue memberLoop;
                        }
                    }
                    userNames.push(getUserName(member))
                }
                const groupScore = groupScores[obj.existing_group_id] ? groupScores[obj.existing_group_id] : null;
                return (
                    <GroupCard key={obj.id} className={className} dayOfWeek={dayOfWeek} time={time} users={userNames} groupCompatibilityScore={groupScore} isCardRecommended={isCardRecommended} handleUpdateGroupStatus={handleUpdateGroupStatus} groupId={obj.id} recommendationsChangedAt={recommendationsChangedAt} fetchData={fetchData} existingId={obj.existing_group_id} status={obj.status} user={user} handleFavorited={handleFavorited}/>
                )
            }
        }
    }

    return (
        <main>
            {isLoading ? (
                <LoadingIndicator loading={isLoading} className="loading-spinner"/>
            ) : (
                <div className="group-list-container">
                    {POSSIBLE_STATUS.map((status) => {
                        if (!statusGroups || !statusGroups[status] || statusGroups[status].length === 0){
                            return null;
                        }
                        return (
                            <div key={status}>
                                <h3>{status.charAt(0).toLocaleUpperCase() + status.slice(1)} Groups</h3>
                                <div className="group-list-section" id={status}>
                                    {
                                        statusGroups && statusGroups[status] &&
                                        statusGroups[status].map(obj => {
                                            return displayGroupCard(obj)
                                        })
                                    }
                                </div>
                            </div> 
                        )
                    })}
                </div>
            )}
        </main>
    )
}

export default GroupList;