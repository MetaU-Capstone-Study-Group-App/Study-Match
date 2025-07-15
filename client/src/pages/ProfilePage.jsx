import Navbar from '../components/Navbar';
import { useUser } from "../contexts/UserContext";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import Footer from '../components/Footer';

// Displays profile information for a specific user
const ProfilePage = () => {
    const {user, setUser} = useUser();
    const [uploadedFile, setUploadedFile] = useState(null);
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleLogout = async () => {
        await fetch("http://localhost:3000/auth/logout", {method: "POST", credentials: "include"});
        setUser(null); 
        navigate("/");
    };

    const fetchData = async (endpoint, method = "GET", credentials = "same-origin", body = null) => {
        try {
            const response = await fetch(`http://localhost:3000/${endpoint}`, {
                method: method,
                credentials: credentials,
                body: body,
            });
            if (!response.ok){
                throw new Error('Not able to fetch data.')
            }
            return response;
        }
        catch (error) {
            setError("Error. Please try again.");
            return null;
        }
    }

    const fetchProfilePicture = async () => {
        const imageToDisplay = await fetchData(`user/profilePicture/${user.id}`, "GET", "include", null);
        const imageBlob = await imageToDisplay.blob();
        setUploadedFile(URL.createObjectURL(imageBlob));
    }

    const handleFileInputChange = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('profile_picture', file);
        const storeImage = await fetchData(`user/upload/${user.id}`, "PUT", "include", formData);
        fetchProfilePicture();
    }

    useEffect(() => {
        if (user){
            fetchProfilePicture();
        }
    }, [user])

    return (
        <div>
        <div className="profile-page">
        <header className="profile-page-header">
            <Navbar />
        </header>

        <main className="profile-page-main">
            <div>
                {user && user.username ? (
                    <>
                        <div className="profile-top">
                            <h1 className="page-header">Hello, {user.name}!</h1>
                        </div>
                        <div className="profile-info-section">
                            <div className="profile-left">
                                <img src={uploadedFile ? uploadedFile : "src/images/profile-pic.png"} alt={user.name} className="profile-pic" width="250" height="250"/>
                                <FileUpload handleFileInputChange={handleFileInputChange}/>
                            </div>
                            <div className="profile-right">
                                <p><b>Username:</b> {user.username}</p>
                                <p><b>Current Study Groups:</b></p>
                            </div>
                            <div className='profile-buttons'>
                                <button className="buttons" onClick={handleLogout}>Log Out</button>
                                <button className="buttons">Edit Profile</button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div>Please log in or sign up.</div>
                        <button type="submit" className="buttons" onClick={() => {navigate("/auth/login")}}>Log In</button>
                        <button type="submit" className="buttons" onClick={() => {navigate("/auth/signup")}}>Sign Up</button>
                    </>
                )}
            </div>
            {error && (
                <p>{error}</p>
            )}
        </main>

        <Footer />
        </div>
        </div>
    )
}

export default ProfilePage;