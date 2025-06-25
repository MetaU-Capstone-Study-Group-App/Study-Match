import './styles.css'
import Navbar from './NavBar';
import { useNavigate } from 'react-router-dom';


const Home = () => {
    const navigate = useNavigate();
    const handleSignUp = () => {
        navigate('/auth/signup');
    }
    const handleLogin = () => {
        navigate('/auth/login');
    }
    return (
        <div className="home">
        <header className="home-header">
            <Navbar />
            <h2>The study group that fits you.</h2>
        </header>

        <main className="home-main">
            <button onClick={handleSignUp}>go to signup</button>
            <button onClick={handleLogin}>go to login</button>
        </main>

        <footer className="home-footer">
            <p>© Study Match. All Rights Reserved.</p>
        </footer>
        </div>
    )
}

export default Home