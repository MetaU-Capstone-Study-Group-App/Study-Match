import { useNavigate } from 'react-router-dom';
import Navbar from './NavBar';

const GroupsPage = () => {
    return (
        <div className="profile-page">
        <header className="profile-page-header">
            <Navbar />
            <h2>Your Groups</h2>
        </header>

        <main className="profile-page-main">  
        </main>

        <footer className="footer">
            <p>© Study Match. All Rights Reserved.</p>
        </footer>
        </div>
    )
}

export default GroupsPage;