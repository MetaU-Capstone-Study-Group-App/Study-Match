import { useState } from "react";
import '../styles.css'
import WeekDays from "../data/WeekDays";

// Allows users to create a new study group
const NewGroupModal = ({groupModalIsOpen, onModalClose, createGroup, fetchData, classList, fetchExistingGroups}) => {
    const TIME_INPUT_TYPE = "time";
    const DEFAULT_START = "08:00";
    const DEFAULT_END = "09:00";
    const HOURS_IN_DAY = 24;
    const [className, setClassName] = useState("")
    const [dayOfWeek, setDayOfWeek] = useState("")
    const [startTime, setStartTime] = useState(DEFAULT_START)
    const [endTime, setEndTime] = useState(DEFAULT_END)

    if (!groupModalIsOpen){
        return null;
    }

    const getClassId = async (className) => {
        const classes = await fetchData('availability/classes/', "GET", {"Content-Type": "application/json"});
        for (const c of classes){
            if (c.name === className){
                return c.id;
            }
        }
    }

    const handleNewGroupSubmit = async (event) => {
        event.preventDefault();
        const classId = await getClassId(className);
        createGroup({class_id: classId, day_of_week: Number(dayOfWeek), start_time: startTime, end_time: endTime});
        setClassName("");
        setDayOfWeek("");
        setStartTime(DEFAULT_START);
        setEndTime(DEFAULT_END);
        fetchExistingGroups();
        onModalClose();
    }
    
    const handleModalClose = () => {
        onModalClose();
    }

    const getEndTime = (startTime) => {
        const [startHour, startMinute] = startTime.split(":").map(Number);
        const endHour = (startHour + 1) % HOURS_IN_DAY;
        const formattedEndHour = endHour.toString().padStart(2, "0");
        const formattedEndMinutes = startMinute.toString().padStart(2, "0");
        const oneHourAfterStart = `${formattedEndHour}:${formattedEndMinutes}`;
        setEndTime(oneHourAfterStart);
    }

    return (
        <div className="new-group-modal">
            <div className="new-group-modal-content">
                <div className="new-group-modal-close-button">
                    <span className="close" onClick={handleModalClose}>&times;</span>
                </div>
                <h3>Create a New Group</h3>
                <form onSubmit={handleNewGroupSubmit} className="new-group-modal-form">
                    <div className="new-group-modal-dropdowns">
                    <select
                        className="event-popup-inputs"
                        value={className}
                        onChange={(e) => {
                            setClassName(e.target.value);
                        }}
                        required
                    >
                        <option value="" disabled>Select a Class</option>
                        {classList.map((c) => (
                            <option value={c.name} key={c.id}>{c.name}</option> 
                        ))}
                    </select>
                    <select
                        className="event-popup-inputs"
                        value={dayOfWeek}
                        onChange={(e) => {
                            setDayOfWeek(e.target.value);
                        }}
                        required
                    >
                        <option value="" disabled>Day of the Week</option>
                        {Object.keys(WeekDays).map((day) => (
                            <option key={day} value={WeekDays[day]}>{day}</option>
                        ))}
                    </select>
                    </div>
                    <label>Start:</label>
                    <div>
                        <input
                            className="event-popup-inputs"
                            type={TIME_INPUT_TYPE}
                            value={startTime}
                            onChange={(event) => setStartTime(event.target.value)}
                            onChangeCapture={(event) => getEndTime(event.target.value)}
                            required
                        />
                    </div>
                    <label>End:</label>
                    <div>
                        <input
                            className="event-popup-inputs"
                            type={TIME_INPUT_TYPE}
                            value={endTime}
                            readOnly
                            required
                        />
                    </div>
                    <div className="new-group-modal-buttons">
                        <button type="submit" className="new-group-modal-submit">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NewGroupModal;