import { useEffect, useState } from "react";
import '../styles.css';

const EventPopup = ({isOpen, onClose, onSave, date, event}) => {
    const [title, setTitle] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");

    const convertTimeZone = (date) => {
        date.setHours(date.getHours() - 7);
        return date;
    }

    useEffect(() => {
        if (event) {
            setTitle(event.title || "");
            setStart(event.start.toISOString().slice(0, 16));
            setEnd(event.end.toISOString().slice(0, 16));
        } else if (date) {
            let defaultStart = new Date(date);
            defaultStart = convertTimeZone(defaultStart);
            const defaultEnd = new Date(defaultStart.getTime() + 60 * 60 * 1000);
            setStart(defaultStart.toISOString().slice(0, 16));
            setEnd(defaultEnd.toISOString().slice(0, 16));
            setTitle("");
        }
    }, [date, event])

    const handleSubmit = (event) => {
        event.preventDefault();
        onSave({
            id: event?.id,
            title,
            start: new Date(start),
            end: new Date(end),
        })
    }

    if (!isOpen) return null;

    return (
        <div className="event-popup-container">
            <div className="event-popup-form">
                <h2>{event ? "Edit Event" : "Add Event"}</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Title:</label>
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
                            type="datetime-local"
                            value={start}
                            onChange={(event) => setStart(event.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>End:</label>
                        <input
                            className="event-popup-inputs"
                            type="datetime-local"
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