import { useNavigate } from 'react-router-dom';
import './styles.css'

const Navbar = () => {
    const navigate = useNavigate();

    const handleNavigateProfilePage = async () => {
        navigate('/profile');
    }

    const handleNavigateHomePage = () => {
        navigate('/');
    }

    const handleNavigateGroupsPage = () => {
        navigate('/groups');
    }

    return (
        <div className="navbar">
            <div className="navbar-left">
                <h1>Study Match</h1>
            </div>
            <div className="navbar-right">
                <button className="navbar-home-button" onClick={handleNavigateHomePage}>Home</button>
                <button className='navbar-groups-button' onClick={handleNavigateGroupsPage}>My Groups</button>
                <button className="navbar-profile-button" onClick={handleNavigateProfilePage}>Profile</button>
            </div>
        </div>
    )
}

export default Navbar;