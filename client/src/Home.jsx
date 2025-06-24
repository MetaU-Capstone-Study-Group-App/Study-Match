import { useNavigate } from 'react-router-dom'; 

const Home = () => {
    const navigate = useNavigate();
    
    const handleProfilePage = () => {
        navigate('/profile');
    }

    return (
        <div className="home">
        <header className="home-header">
            <h1>Study Match</h1>
        </header>

        <main className="home-main">
            <button onClick={handleProfilePage}>Go to Profile</button>
        </main>

        <footer className="home-footer">
            <p>© Study Match. All Rights Reserved.</p>
        </footer>
        </div>
    )
}

export default Home