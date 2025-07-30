import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from '../contexts/UserContext';
import '../styles.css'
import EmptyNavBar from "../components/EmptyNavBar";
import LoadingIndicator from "../components/LoadingIndicator";
import baseUrl from "../utils/baseUrl";

const ResetPasswordPage = () => {
    const [formData, setFormData] = useState({username: "", new_password: ""});
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const {setUser} = useUser();
    const [isLoading, setIsLoading] = useState(false);

    const handlePasswordChange = (event) => {
        const {name, value} = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePasswordSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch(`${baseUrl}/auth/resetPassword`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData),
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({type: "success", text: "Password was reset successfully!"});
                setUser(data); 
                setIsLoading(false);
                navigate("/home"); 
            } else {
                setIsLoading(false);
                setMessage({type: "error", text: data.error || "Password reset failed."});
            }
        } catch (error) {
            setIsLoading(false);
            setMessage({type: "error", text: "Network error. Please try again."});
        }
    };
    return (
        <div className="reset-password">
            <EmptyNavBar />
            <h2>Reset Password</h2>
            <form onSubmit={handlePasswordSubmit} className="reset-password-form">
                <label className="reset-password-labels">
                    Username:
                    <input
                        type="text"
                        className="reset-password-username-input"
                        name="username"
                        value={formData.username}
                        onChange={handlePasswordChange}
                        required
                    />
                </label>

                <label className="reset-password-labels">
                    New Password:
                    <input
                        type="password"
                        className="reset-password-password-input"
                        name="new_password"
                        value={formData.new_password}
                        onChange={handlePasswordChange}
                        required
                    />
                </label>

                <button type="submit" className="buttons">Reset Password</button>
                <div className="loading-section">
                    {isLoading &&
                        <LoadingIndicator loading={isLoading} className="loading-spinner"/>
                    }
                </div>
                {message && (
                    <p className={`message ${message.type}`}>{message.text}</p>
                )}
            </form>
            <footer className="footer">
                <p>© Study Match. All Rights Reserved.</p>
            </footer>
        </div>
    );
}

export default ResetPasswordPage;