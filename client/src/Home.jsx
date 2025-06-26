import './styles.css'
import Navbar from './NavBar';
import { useNavigate } from 'react-router-dom';

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

        <footer className="footer">
            <p>© Study Match. All Rights Reserved.</p>
        </footer>
        </div>
    )
}

export default Home