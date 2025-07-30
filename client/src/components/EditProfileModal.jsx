import { useState } from "react";
import '../styles.css'

const EditProfileModal = ({editProfileIsOpen, onEditProfileClose, editProfileInfo}) => {
    const [formData, setFormData] = useState({})

    if (!editProfileIsOpen){
        return null;
    }

    const handleEditProfileSubmit = async (event) => {
        event.preventDefault();
        editProfileInfo(formData);
        handleModalClose();
    }
    
    const handleModalClose = () => {
        onEditProfileClose();
    }

    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="new-group-modal">
            <div className="new-group-modal-content">
                <div className="new-group-modal-close-button">
                    <span className="close" onClick={handleModalClose}>&times;</span>
                </div>
                <h3>Edit Profile Information</h3>
                <form onSubmit={handleEditProfileSubmit} className="edit-profile-modal-form">
                    <div className="edit-profile-row">
                        <label>Username:
                            <div>
                                <input
                                    className="signup-inputs"
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </label>
                        <label>Email Address:
                            <div>
                                <input
                                    className="signup-inputs"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </label>
                        <label>Phone Number:
                            <div>
                                <input
                                    className="signup-inputs"
                                    type="tel"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    pattern="[0-9]{10}"
                                    maxLength="10"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </label>
                        <label>School:
                            <div>
                                <input
                                    className="signup-inputs"
                                    type="text"
                                    name="school"
                                    value={formData.school}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </label>
                    </div>
                    <div className="edit-profile-row">
                        <label>Class Standing
                            <select name="class_standing" className="signup-inputs" value={formData.class_standing} onChange={handleInputChange}>
                                <option disabled selected>Select an option</option>
                                <option value="freshman">Freshman</option>
                                <option value="sophomore">Sophomore</option>
                                <option value="junior">Junior</option>
                                <option value="senior">Senior</option>
                            </select>
                        </label>
                    </div>
                    <div className="edit-profile-time-row">
                        <div className="signup-time-input">
                            <label>Preferred Start Time
                                <input
                                    type="time"
                                    className="signup-inputs"
                                    name="preferred_start_time"
                                    value={formData.preferred_start_time}
                                    onChange={handleInputChange}
                                />
                            </label>
                        </div>
                        <div className="signup-time-input">
                            <label>Preferred End Time
                                <input
                                    type="time"
                                    className="signup-inputs"
                                    name="preferred_end_time"
                                    value={formData.preferred_end_time}
                                    onChange={handleInputChange}
                                />
                            </label>
                        </div>
                    </div>
                    <div className="new-group-modal-buttons">
                        <button type="submit" className="new-group-modal-submit">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditProfileModal;