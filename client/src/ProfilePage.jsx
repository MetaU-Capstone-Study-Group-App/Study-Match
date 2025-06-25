import Navbar from './NavBar';
import { useUser } from "./contexts/UserContext";
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const { user, setUser } = useUser();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await fetch("http://localhost:3000/auth/logout", { method: "POST", credentials: "include" });
        setUser(null); 
        navigate("/");
    };

    return (
        <div>
        <div className="profile-page">
        <header className="profile-page-header">
            <Navbar />
        </header>

        <main className="profile-page-main">
            <div>
                {user ? (
                    <>
                        <h2>Welcome, {user.username}!</h2>
                        <button className="buttons" onClick={handleLogout}>Log Out</button>
                    </>
                ) : (
                    <>
                        <a href="/auth/signup">Sign Up</a>
                        <a href="/auth/login">Login</a>
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