import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from '../contexts/UserContext';
import { API_URL } from "../utils/apiConfig";

// Handles user authentication
const WithAuth = (WrappedComponent) => {
    const ProtectedComponent = (props) => {
        const {user, setUser} = useUser();
        const navigate = useNavigate();

        useEffect(() => {
            if (!user) {
                fetch(`${API_URL}/auth/me`, {credentials: "include"})
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.id) { 
                            setUser(data); 
                        } else {
                            navigate("/");
                        }
                    })
                    .catch(() => {
                        navigate("/");
                    });
            }
        }, [user, setUser, navigate]);

        if (!user) {
            return <p>Loading...</p>; 
        }

        return <WrappedComponent {...props} />;
    };

    return ProtectedComponent;
};

export default WithAuth;