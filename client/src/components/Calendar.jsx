import { useState, useEffect } from "react";
import { Calendar as ReactBigCalendar , momentLocalizer } from "react-big-calendar";
import moment from "moment";
import '../styles.css';
import "react-big-calendar/lib/css/react-big-calendar.css";
import EventPopup from "./EventPopup"; 
import { useUser } from "../contexts/UserContext";
import WeekDays from "../data/WeekDays";
import MatchByAvailability from "../utils/MatchByAvailability";
import CompatibilityScore from "../utils/CompatibilityScore";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/apiConfig";

const localizer = momentLocalizer(moment);
const DEFAULT_YEAR = 2025;
const DEFAULT_MONTH = 5;
const DEFAULT_DAY = 1;

// Calendar component that takes in user availability using React Big Calendar and Moment.js
const Calendar = () => {
    const {user, setUser} = useUser();
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isOpenEvent, setIsOpenEvent] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [eventId, setEventId] = useState();
    const [busyTimes, setBusyTimes] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const eventPropGetter = (event) => {
        const backgroundColor = '#068484';
        return { 
            style: { 
                backgroundColor 
            } 
        }
    }

    const fetchData = async (endpoint, method = "GET", headers, credentials = "include", body = null) => {
        try {
            const response = await fetch(`${API_URL}/${endpoint}`, {
                method: method,
                headers: headers,
                credentials: credentials,
                body: body,
            });
            if (!response.ok){
                throw new Error('Not able to fetch data.')
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            setError("Error. Please try again.");
            return null;
        }
    }

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setSelectedDate(null);
        setIsOpenEvent(true);
    }

    const handleSelectSlot = (slotInfo) => {
        setSelectedDate(slotInfo.start);
        setSelectedEvent(null);
        setIsOpenEvent(true);
    }

    const handleSaveEvent = (eventData) => {
        const eventExists = Boolean(eventData.id);

        if (eventData.id) {
            setEvents((prev) =>
                prev.map((ev) => (ev.id === eventData.id ? eventData : ev))
            );
        } else {
            const newEvent = {
                ...eventData,
                id: events.length + 1
            }
            setEvents((prev) => [...prev, newEvent]);
        }
        storeBusyTime(eventData, eventExists);
        setIsOpenEvent(false);
        setSelectedDate(null);
        setSelectedEvent(null);
    }

    const storeBusyTime = async (eventData, eventExists) => {
        const busyTimeEndpoint = eventExists ? `availability/busyTime/${eventId}/` : "availability/busyTime/";
        const busyTimeMethod = eventExists ? "PUT" : "POST";
        const dayOfWeekInt = WeekDays[eventData.start.toLocaleDateString('en-US', { weekday: 'long' })];
        const newBusyTimeData = {
            user_id: user.id,
            day_of_week: dayOfWeekInt,
            start_time: eventData.start.toLocaleTimeString('en-US', { hour12: false }),
            end_time: eventData.end.toLocaleTimeString('en-US', { hour12: false }),
            class_name: eventData.title
        }
        const newBusyTime = await fetchData(busyTimeEndpoint, busyTimeMethod, {"Content-Type": "application/json"}, "include", JSON.stringify(newBusyTimeData));
        setEventId(newBusyTime.id);
    }

    const fetchEvents = async () => {
        if (user){
            const userEvents = await fetchData(`availability/busyTime/${user.id}`, "GET", {"Content-Type": "application/json"}, "include");
            setBusyTimes(userEvents);
            const formattedEvents = userEvents.map(e => {
                const dayOfWeek = e.day_of_week;
                const initialDate = new Date(DEFAULT_YEAR, DEFAULT_MONTH, dayOfWeek)
                const [startHour, startMinute] = e.start_time.split(":");
                const [endHour, endMinute] = e.end_time.split(":");
                const startDate = new Date(initialDate);
                startDate.setHours(startHour, startMinute);
                const endDate = new Date(initialDate);
                endDate.setHours(endHour, endMinute);
                setEventId(e.id);

                return {
                    id: e.id,
                    title: e.class_name,
                    start: startDate,
                    end: endDate,
                }
            })
            setEvents(formattedEvents);
        }
    }

    const formats = {
        dayFormat: (date, culture, localizer) =>
            localizer.format(date, 'dddd', culture),
    }

    const fetchUsers = async () => {
        const users = await fetchData("user/", "GET");
        setAllUsers(users);
    }

    useEffect(() => {
        fetchEvents();
        fetchUsers();
    }, [user])

    const matchByAvailability = async () => {
        await MatchByAvailability(fetchData, allUsers);
        CompatibilityScore(fetchData, user);
        navigate("/groups");
    }

    return (
        <>
            <div className="calendar">
                <ReactBigCalendar
                    className="calendar-component"
                    selectable
                    localizer={localizer}
                    events={events}
                    defaultView="week"
                    views={["week"]}
                    toolbar={false}
                    startAccessor="start"
                    endAccessor="end"
                    date={new Date(DEFAULT_YEAR, DEFAULT_MONTH, DEFAULT_DAY)}
                    onSelectSlot={handleSelectSlot}
                    onSelectEvent={handleSelectEvent}
                    eventPropGetter={eventPropGetter}
                    formats={formats}
                />
            </div>
            {isOpenEvent && (
                <EventPopup
                    isOpen={isOpenEvent}
                    onClose={() => setIsOpenEvent(false)}
                    onSave={handleSaveEvent}
                    date={selectedDate}
                    event={selectedEvent}
                    fetchData={fetchData}
                    user={user}
                />
            )}
            <button className="buttons" id='submit-availability-button' onClick={matchByAvailability}>Submit Availability</button>
            {error && (
                <p>{error}</p>
            )}
        </>
    )
}

export default Calendar;

