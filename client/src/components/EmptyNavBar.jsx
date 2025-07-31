import '../styles.css'
import NoBackgroundLogo from '/src/images/logo-no-background.png'

const EmptyNavBar = () => {
    return (
        <div className="empty-navbar">
            <div className="empty-navbar-left">
                <div className="navbar-logo">
                    <img src={NoBackgroundLogo} width="85" height="50"/>
                </div>
                <h1>Study Match</h1>
            </div>
        </div>
    )
}

export default EmptyNavBar;