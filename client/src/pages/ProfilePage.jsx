import Navbar from '../NavBar';
import { useUser } from "../contexts/UserContext";
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import FileUpload from '../FileUpload';

const ProfilePage = () => {
    const {user, setUser} = useUser();
    const [uploadedFile, setUploadedFile] = useState();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await fetch("http://localhost:3000/auth/logout", {method: "POST", credentials: "include"});
        setUser(null); 
        navigate("/");
    };

    const handleFileInputChange = async (event) => {
        const formData = new FormData();
        formData.append('profile_picture', uploadedFile);
        try {
            const response = await fetch(`http://localhost:3000/user/upload/${user.id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                body: formData,
            });
            if (!response.ok){
                throw new Error('Not able to fetch data.')
            }
            const data = await response.json();
            setUploadedFile(data);
        }
        catch {
            console.log("Error fetching data.")
        }
        setUploadedFile(URL.createObjectURL(event.target.files[0]));
    }

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
                                <img src={uploadedFile ? uploadedFile : "src/images/profile-pic.png"} alt="user.name" className="profile-pic" width="250" height="250"/>
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
                        <div className="avilability-info-section">
                            <h1 className="page-header">Your Availability</h1>
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
        </main>

        <footer className="footer">
            <p>© Study Match. All Rights Reserved.</p>
        </footer>
        </div>
        </div>
    )
}

export default ProfilePage;