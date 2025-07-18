import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from '../contexts/UserContext';

// Handles user authentication
const WithAuth = (WrappedComponent) => {
    const ProtectedComponent = (props) => {
        const {user, setUser} = useUser();
        const navigate = useNavigate();

        useEffect(() => {
            if (!user) {
                fetch("http://localhost:3000/auth/me", {credentials: "include"})
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