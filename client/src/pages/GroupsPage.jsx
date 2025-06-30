import { useNavigate } from 'react-router-dom';
import Navbar from '../NavBar';
import Footer from '../Footer';

const GroupsPage = () => {
    return (
        <div className="profile-page">
        <header className="profile-page-header">
            <Navbar />
            <h2>Your Groups</h2>
        </header>

        <main className="profile-page-main">  
        </main>
        
        <Footer />
        </div>
    )
}

export default GroupsPage;