import { useNavigate } from 'react-router-dom';
import '../styles.css'
import Logo from '/src/images/logo-no-background.png'

const Navbar = ({page}) => {
    const navigate = useNavigate();

    const handleNavigateProfilePage = () => {
        navigate('/profile');
    }

    const handleNavigateHomePage = () => {
        navigate('/home');
    }

    const handleNavigateGroupsPage = () => {
        navigate('/groups');
    }

    return (
        <div className="navbar">
            <div className="navbar-left">
                <div className="navbar-logo">
                    <img src={Logo} width="85" height="50"/>
                </div>
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