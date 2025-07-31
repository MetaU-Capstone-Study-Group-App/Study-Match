import Footer from "../components/Footer";
import Calendar from "../components/Calendar";
import EmptyNavBar from "../components/EmptyNavBar";

// Allows users to input their availability/classes
const CalendarPage = () => {
    return (
        <div className="calendar-page-container">
            <EmptyNavBar />
            <div className="page-header">Availability</div>
            <p>Please input the classes you're taking, along with their respective times and days.</p>
            <p>If you have a meeting or other recurring event, please select "Meeting" or "Other".</p>
            <Calendar />
            <Footer />
        </div>
    )
}

export default CalendarPage;