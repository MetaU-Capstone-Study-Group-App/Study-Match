import { useState } from "react";
import { Calendar as ReactBigCalendar , momentLocalizer } from "react-big-calendar";
import moment from "moment";
import '../styles.css';
import "react-big-calendar/lib/css/react-big-calendar.css";
import EventPopup from "./EventPopup"; 

const localizer = momentLocalizer(moment);

const Calendar = () => {
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isOpenEvent, setIsOpenEvent] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const eventPropGetter = (event) => {
        const backgroundColor = '#068484';
        return { 
            style: { 
                backgroundColor 
            } 
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
        setIsOpenEvent(false);
        setSelectedDate(null);
        setSelectedEvent(null);
    }

    return (
        <>
            <div className="calendar">
                <ReactBigCalendar
                    className="calendar-component"
                    selectable
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    onSelectSlot={handleSelectSlot}
                    onSelectEvent={handleSelectEvent}
                    eventPropGetter={eventPropGetter}
                />
            </div>
            {isOpenEvent && (
                <EventPopup
                    isOpen={isOpenEvent}
                    onClose={() => setIsOpenEvent(false)}
                    onSave={handleSaveEvent}
                    date={selectedDate}
                    event={selectedEvent}
                />
            )}
        </>
    )
}

export default Calendar;

