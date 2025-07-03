import { useEffect, useState } from "react";
import '../styles.css';
import WeekDays from "../data/WeekDays";

const TIME_INPUT_TYPE = "time";
const MILLISECONDS_IN_HOUR = 3600000;
const DEFAULT_YEAR = 2025;
const DEFAULT_MONTH = 5;
const END_OF_TIME_FORMAT_LENGTH = 5;

const EventPopup = ({isOpen, onClose, onSave, date, event}) => {
    const [title, setTitle] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [weekday, setWeekday] = useState("");

    useEffect(() => {
        if (event) {
            setTitle(event.title || "");
            setStart(event.start.toTimeString().slice(0, END_OF_TIME_FORMAT_LENGTH));
            setEnd(event.end.toTimeString().slice(0, END_OF_TIME_FORMAT_LENGTH));
            setWeekday(new Date(event.start).toLocaleDateString('en-US', {weekday: "long"}));
        } else if (date) {
            const defaultStart = new Date(date);
            const defaultEnd = new Date(defaultStart.getTime() + MILLISECONDS_IN_HOUR);
            setStart(defaultStart.toTimeString().slice(0, END_OF_TIME_FORMAT_LENGTH));
            setEnd(defaultEnd.toTimeString().slice(0, END_OF_TIME_FORMAT_LENGTH));
            setWeekday(new Date(date).toLocaleDateString('en-US', {weekday: "long"}));
            setTitle("");
        }
    }, [date, event])

    const handleSubmit = (e) => {
        e.preventDefault();

        const dayOfWeek = WeekDays[weekday];
        const initialDate = new Date(DEFAULT_YEAR, DEFAULT_MONTH, dayOfWeek)
        const [startHour, startMinute] = start.split(":");
        const [endHour, endMinute] = end.split(":");
        const startDate = new Date(initialDate);
        startDate.setHours(startHour, startMinute);
        const endDate = new Date(initialDate);
        endDate.setHours(endHour, endMinute);

        onSave ({
            id: event?.id,
            title,
            start: startDate,
            end: endDate,
        })
    }

    if (!isOpen) return null;

    return (
        <div className="event-popup-container">
            <div className="event-popup-form">
                <h2>{event ? "Edit Class" : "Add Class"}</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Class Name:</label>
                        <input
                            className="event-popup-inputs"
                            type="text"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Start:</label>
                        <input
                            className="event-popup-inputs"
                            type={TIME_INPUT_TYPE}
                            value={start}
                            onChange={(event) => setStart(event.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>End:</label>
                        <input
                            className="event-popup-inputs"
                            type={TIME_INPUT_TYPE}
                            value={end}
                            onChange={(event) => setEnd(event.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="event-popup-button">Save</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    )
}

export default EventPopup;