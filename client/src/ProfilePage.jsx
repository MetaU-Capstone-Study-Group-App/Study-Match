import Navbar from './NavBar';

const ProfilePage = () => {
    return (
        <div className="profile-page">
        <header className="profile-page-header">
            <Navbar />
            <h2>Your Profile</h2>
        </header>

        <main className="profile-page-main">
            
        </main>

        <footer className="profile-page-footer">
            <p>© Study Match. All Rights Reserved.</p>
        </footer>
        </div>
    )
}

export default ProfilePage;