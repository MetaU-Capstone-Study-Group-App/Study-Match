import { useEffect, useState } from "react";
import '../styles.css';
import WeekDays from "../data/WeekDays";

const TIME_INPUT_TYPE = "time";
const MILLISECONDS_IN_HOUR = 3600000;
const DEFAULT_YEAR = 2025;
const DEFAULT_MONTH = 5;
const END_OF_TIME_FORMAT_LENGTH = 5;

// Individual event component used to display classes/events in the Calendar component
const EventPopup = ({isOpen, onClose, onSave, date, event, fetchData, user}) => {
    const [title, setTitle] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [weekday, setWeekday] = useState("");
    const [isCreatingClass, setIsCreatingClass] = useState(false);
    const [classList, setClassList] = useState([]);
    const [newClassName, setNewClassName] = useState("");

    useEffect(() => {
        const fetchClasses = async () => {
            const classData = await fetchData("availability/classes/", "GET");
            const sortedClassData = classData.sort((a,b) => 
                a.name.localeCompare(b.name)
            )
            setClassList(sortedClassData);
        }
        fetchClasses();
    }, [])

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

    const getClassId = async (className) => {
        const classes = await fetchData('availability/classes/', "GET", {"Content-Type": "application/json"});
        for (const c of classes){
            if (c.name === className){
                return c.id;
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        let eventTitle = title;
        if (isCreatingClass && newClassName){
            const newClass = await fetchData('availability/classes/', "POST", {"Content-Type": "application/json"}, "same-origin", JSON.stringify({name: newClassName}));
            eventTitle = newClass.name;
        }

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
            title: eventTitle,
            start: startDate,
            end: endDate,
        })

        const classId = await getClassId(eventTitle);
        const newUserClass = await fetchData('availability/userClasses/', "POST", {"Content-Type": "application/json"}, "same-origin", JSON.stringify({user_id: user.id, class_id: classId}));
    }

    if (!isOpen) return null;

    return (
        <div className="event-popup-container">
            <div className="event-popup-form">
                <h2>{event ? "Edit Event" : "Add Event"}</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Class/Event Name:</label>
                        {!isCreatingClass ? (
                            <select
                                className="event-popup-inputs"
                                value={title}
                                onChange={(e) => {
                                    if (e.target.value === "add_new_class"){
                                        setIsCreatingClass(true);
                                        setTitle("");
                                    }
                                    else {
                                        setTitle(e.target.value);
                                    }
                                }}
                                required
                            >
                                <option value="" disabled>Select a Class/Event</option>
                                <option value="Meeting">Meeting</option>
                                <option value="add_new_class">Add a New Class</option>
                                {classList.map((c) => (
                                    <option value={c.name} key={c.id}>{c.name}</option> 
                                ))}
                                <option value="Other">Other</option>
                            </select>
                        ) : (
                            <div>
                                <input
                                    className="event-popup-inputs"
                                    type="text"
                                    placeholder="Name of New Class"
                                    value={newClassName}
                                    onChange={(event) => setNewClassName(event.target.value)}
                                    required
                                />
                                <button className="event-popup-buttons" id="add-class-button" onClick={() => setIsCreatingClass(false)}>Cancel</button>
                            </div>
                        )}
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
                    <button type="submit" className="event-popup-buttons">Save</button>
                    <button type="button" className="event-popup-buttons" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    )
}

export default EventPopup;