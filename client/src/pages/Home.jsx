import '../styles.css'
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import HomeSlogan from '../components/HomeSlogan';

const Home = () => {
    const navigate = useNavigate();

    const handleGroupsNavigate = () => {
        navigate("/groups");
    }

    return (
        <div className="home">
        <header className="home-header">
            <Navbar />
        </header>

        <main className="home-main">
            <HomeSlogan />
            <button className="buttons" id="go-to-groups-button" onClick={handleGroupsNavigate}>Go to Your Study Groups</button>
        </main>

        <Footer />
        </div>
    )
}

export default Home