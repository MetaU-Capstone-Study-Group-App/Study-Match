import '../styles.css'
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import HomeSlogan from '../components/HomeSlogan';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home">
        <header className="home-header">
            <Navbar />
        </header>

        <main className="home-main">
            <HomeSlogan />
        </main>

        <Footer />
        </div>
    )
}

export default Home