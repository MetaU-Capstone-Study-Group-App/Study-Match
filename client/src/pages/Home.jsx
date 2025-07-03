import '../styles.css'
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home">
        <header className="home-header">
            <Navbar />
            <h2>The study group that fits you.</h2>
        </header>

        <main className="home-main">
        </main>

        <Footer />
        </div>
    )
}

export default Home