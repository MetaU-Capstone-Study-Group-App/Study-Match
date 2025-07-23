import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CreateGroup from '../components/CreateGroup';
import NewGroupModal from '../components/NewGroupModal';
import { useUser } from "../contexts/UserContext";
import GroupList from '../components/GroupList';
import LoadingIndicator from '../components/LoadingIndicator';
import ScoreWeights from '../data/ScoreWeights';

// Displays all of the study groups a user is matched into
const GroupsPage = () => {
    const [groupModalIsOpen, setGroupModalIsOpen] = useState(false);
    const [classList, setClassList] = useState([]);
    const {user, setUser} = useUser();
    const [existingGroups, setExistingGroups] = useState([]);
    const [userExistingGroups, setUserExistingGroups] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentStatus, setCurrentStatus] = useState({});
    const [scoreWeights, setScoreWeights] = useState({});

    const fetchData = async (endpoint, method = "GET", headers, credentials = "same-origin", body = null) => {
        try {
            const response = await fetch(`http://localhost:3000/${endpoint}`, {
                method: method,
                headers: headers,
                credentials: credentials,
                body: body,
            });
            if (!response.ok){
                throw new Error('Not able to fetch data.')
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            setError("Error. Please try again.");
            return null;
        }
    }

    const loadData = async () => {
        await fetchClasses();
        await fetchExistingGroups();
        await fetchUsers();
        setIsLoading(false);
    }

    const addUserToGroup = async (newGroupId) => {
        const newUserExistingGroupData = {
            user_id: user.id,
            existing_group_id: newGroupId
        }
        const newUserExistingGroup = await fetchData("group/userExistingGroup/", "POST", {"Content-Type": "application/json"}, "same-origin", JSON.stringify(newUserExistingGroupData));
    }

    const createGroup = async (newGroupData) => {
        setIsLoading(true);
        const newGroup = await fetchData("group/existingGroup/", "POST", {"Content-Type": "application/json"}, "same-origin", JSON.stringify(newGroupData));
        await addUserToGroup(newGroup.id);
        loadData();
    }

    const onModalClose = () => {
        setGroupModalIsOpen(false);
    }

    const fetchExistingGroups = async () => {
        const fetchedExistingGroups = await fetchData("group/existingGroup/", "GET");
        const fetchedUserExistingGroups = await fetchData("group/userExistingGroup/", "GET");
        setExistingGroups(fetchedExistingGroups);
        setUserExistingGroups(fetchedUserExistingGroups);
    }

    const fetchClasses = async () => {
        const classData = await fetchData("availability/classes/", "GET");
        const sortedClassData = classData.sort((a,b) => 
            a.name.localeCompare(b.name)
        )
        setClassList(sortedClassData);
    }

    const fetchWeights = async () => {
        const weights = await ScoreWeights(fetchData, user.id);
        setScoreWeights(weights);
    }

    useEffect(() => {
        loadData();
    }, [currentStatus])

    useEffect(() => {
        if (user){
            fetchWeights();
        }
    }, [user])

    const getClassName = (classId) => {
        for (const c of classList){
            if (c.id === classId){
                return c.name;
            }
        }
    }

    const fetchUsers = async () => {
        const users = await fetchData("user/", "GET");
        setAllUsers(users);
    }

    const getUserName = (userId) => {
        for (const user of allUsers){
            if (user.id === userId){
                return user.name;
            }
        }
    }

    const handleUpdateGroupStatus = async (groupId, updatedStatus) => {
        const newStatus = {
            status: updatedStatus
        }
        const updatedGroup = await fetchData(`group/userExistingGroup/${groupId}/`, "PUT", {"Content-Type": "application/json"}, "same-origin", JSON.stringify(newStatus));
        setCurrentStatus({groupId, updatedStatus});
    }

    return (
        <div className="groups-page">
            <header className="groups-page-header">
                <Navbar />
                <h2>Your Study Groups</h2>
            </header>

            <main className="groups-page-main"> 
                {isLoading ? (
                    <LoadingIndicator loading={isLoading} />
                ) : (
                    <div>
                        <CreateGroup setGroupModalIsOpen={setGroupModalIsOpen} /> 
                        <NewGroupModal groupModalIsOpen={groupModalIsOpen} onModalClose={onModalClose} createGroup={createGroup} fetchData={fetchData} classList={classList} fetchExistingGroups={fetchExistingGroups}/>
                        <GroupList data={userExistingGroups} user={user} existingGroups={existingGroups} getClassName={getClassName} getUserName={getUserName} fetchData={fetchData} handleUpdateGroupStatus={handleUpdateGroupStatus} currentStatus={currentStatus} scoreWeights={scoreWeights}/>
                    </div>
                )}
                {error && (
                    <p>{error}</p>
                )}
            </main>

            <Footer />
        </div>
    )
}

export default GroupsPage;