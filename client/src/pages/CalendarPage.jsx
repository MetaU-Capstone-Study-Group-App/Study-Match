import Footer from "../components/Footer";
import Calendar from "../components/Calendar";

// Allows users to input their availability/classes
const CalendarPage = () => {
    return (
        <div className="calendar-page-container">
            <div className="navbar">
                <div className="navbar-left">
                    <h1>Study Match</h1>
                </div>
            </div>
            <div className="page-header">Availability</div>
            <p>Please input the classes you're taking, along with their respective times and days.</p>
            <p>If you have a meeting or other recurring event, please select "Meeting" or "Other".</p>
            <Calendar />
            <Footer />
        </div>
    )
}

export default CalendarPage;