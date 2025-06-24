import './styles.css'
import Navbar from './NavBar';

const Home = () => {
    return (
        <div className="home">
        <header className="home-header">
            <Navbar />
            <h2>The study group that fits you.</h2>
        </header>

        <main className="home-main">
            
        </main>

        <footer className="home-footer">
            <p>© Study Match. All Rights Reserved.</p>
        </footer>
        </div>
    )
}

export default Home