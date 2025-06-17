import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export  default function SocialLoginRedirect  ()  {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get("token");

        if (token) {
            sessionStorage.setItem("authorization", token);
            navigate("/dashboard");
        } else {
            navigate("/login");
        }
    }, [location, navigate]);

    return <div>Logging you in via Google...</div>;
};


