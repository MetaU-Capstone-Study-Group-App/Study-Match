import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CreateGroup from '../components/CreateGroup';
import NewGroupModal from '../components/NewGroupModal';
import { useUser } from "../contexts/UserContext";

const GroupsPage = () => {
    const [groupModalIsOpen, setGroupModalIsOpen] = useState(false);
    const [classList, setClassList] = useState([]);
    const {user, setUser} = useUser();

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
        catch {
            console.log("Error fetching data.")
        }
    }

    const addUserToGroup = async (newGroupId) => {
        const newUserExistingGroupData = {
            user_id: user.id,
            existing_group_id: newGroupId
        }
        const newUserExistingGroup = await fetchData("group/userExistingGroup/", "POST", {"Content-Type": "application/json"}, "same-origin", JSON.stringify(newUserExistingGroupData));
    }

    const createGroup = async (newGroupData) => {
        const newGroup = await fetchData("group/existingGroup/", "POST", {"Content-Type": "application/json"}, "same-origin", JSON.stringify(newGroupData));
        addUserToGroup(newGroup.id);
    }

    const onModalClose = () => {
        setGroupModalIsOpen(false);
    }

    useEffect(() => {
        const fetchClasses = async () => {
            const classData = await fetchData("availability/classes/", "GET");
            const sortedClassData = classData.sort((a,b) => 
                a.name.localeCompare(b.name)
            )
            setClassList(sortedClassData);
        }
        fetchClasses();
    }, [])

    return (
        <div className="groups-page">
            <header className="groups-page-header">
                <Navbar />
                <h2>Your Groups</h2>
            </header>

            <main className="groups-page-main"> 
                <CreateGroup setGroupModalIsOpen={setGroupModalIsOpen} /> 
                <NewGroupModal groupModalIsOpen={groupModalIsOpen} onModalClose={onModalClose} createGroup={createGroup} fetchData={fetchData} classList={classList}/>
            </main>

            <Footer />
        </div>
    )
}

export default GroupsPage;