import '../styles.css'
import Navbar from '../NavBar';
import { useNavigate } from 'react-router-dom';
import Footer from '../Footer';

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