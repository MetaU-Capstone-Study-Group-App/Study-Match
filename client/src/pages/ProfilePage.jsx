import Navbar from '../components/Navbar';
import { useUser } from "../contexts/UserContext";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import Footer from '../components/Footer';
import LoadingIndicator from '../components/LoadingIndicator';
import baseUrl from '../utils/baseUrl';
import DefaultProfilePic from '/src/images/profile-pic.png'

// Displays profile information for a specific user
const ProfilePage = () => {
    const {user, setUser} = useUser();
    const [uploadedFile, setUploadedFile] = useState(null);
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [userInfo, setUserInfo] = useState({});

    const handleLogout = async () => {
        await fetch(`${baseUrl}/auth/logout`, {method: "POST", credentials: "include"});
        setUser(null); 
        navigate("/");
    };

    const fetchData = async (endpoint, method = "GET", credentials = "include", body = null) => {
        try {
            setIsLoading(true);
            const response = await fetch(`${baseUrl}/${endpoint}`, {
                method: method,
                credentials: credentials,
                body: body,
            });
            if (!response.ok){
                throw new Error('Not able to fetch data.')
            }
            setIsLoading(false);
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
        if (imageBlob.size !== 0){
            setUploadedFile(URL.createObjectURL(imageBlob));
        }
    }

    const handleFileInputChange = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('profile_picture', file);
        const storeImage = await fetchData(`user/upload/${user.id}`, "PUT", "include", formData);
        fetchProfilePicture();
    }

    const fetchUserInfo = async () => {
        const response = await fetchData(`user/info/${user.name}`, "GET");
        const userProfileInfo = await response.json();
        setUserInfo(userProfileInfo);
    }

    const formatPhoneNumber = (phoneNumber) => {
        if (user && phoneNumber){
            return `(${phoneNumber.slice(0,3)}) ${phoneNumber.slice(3,6)}-${phoneNumber.slice(6,10)}`;
        }
    }

    useEffect(() => {
        if (user){
            fetchUserInfo();
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
            {isLoading ? (
                <LoadingIndicator loading={isLoading} className="loading-spinner"/>
            ) : (
                <div>
                    {user && user.username && userInfo ? (
                        <>
                            <div className="profile-top">
                                <h1 className="page-header">Hello, {user.name}!</h1>
                            </div>
                            <div className="profile-info-section">
                                <div className="profile-left">
                                    <img src={uploadedFile ? uploadedFile : DefaultProfilePic} alt={user.name} className="profile-pic" width="250" height="250"/>
                                    <FileUpload handleFileInputChange={handleFileInputChange}/>
                                </div>
                                <div className="profile-right">
                                    <div className="profile-right-sections">
                                        <p><b>Username:</b> {user.username}</p>
                                        <p><b>Email Address:</b> {userInfo.email}</p>
                                        <p><b>Phone Number:</b> {formatPhoneNumber(userInfo.phone_number)}</p>
                                    </div>
                                    <div className="profile-right-sections">
                                        <p><b>School:</b> {userInfo.school}</p>
                                        <p><b>Class Standing:</b> {userInfo.class_standing}</p>
                                        <p><b>Preferred Study Times:</b> {userInfo.preferred_start_time} - {userInfo.preferred_end_time}</p>
                                    </div>
                                </div>
                                <div className='profile-buttons'>
                                    <button className="buttons" onClick={handleLogout}>Log Out</button>
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
            )}
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