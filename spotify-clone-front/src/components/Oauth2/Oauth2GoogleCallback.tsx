import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { setCredentials } from "../../services/Api/authSlice.tsx";

interface GoogleJwtPayload {
    username: string;
    email: string;
}

const Oauth2GoogleCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();

    useEffect(() => {
        const accessToken = searchParams.get("accessToken");
        const refreshToken = searchParams.get("refreshToken");

        if (accessToken && refreshToken) {
            try {
                const decoded = jwtDecode<GoogleJwtPayload>(accessToken);

                dispatch(setCredentials({ 
                    accessToken, 
                    refreshToken,
                    user: { 
                        username: decoded.username, 
                        email: decoded.email 
                    } 
                }));
                navigate("/", { replace: true });
            } catch (error) {
                console.error("JWT Decode Error:", error);
                navigate("/login");
            }
        } else {
            navigate("/login");
        }
    }, [searchParams, dispatch, navigate]);

    return (
        <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            height: "100vh",
            backgroundColor: "#121212",
            color: "white",
            flexDirection: "column",
            gap: "20px"
        }}>
            <div className="animate-spin" style={{ 
                width: "40px", 
                height: "40px", 
                border: "4px solid #1DB954", 
                borderTopColor: "transparent", 
                borderRadius: "50%" 
            }}></div>
            <h2 style={{ fontFamily: "sans-serif" }}>Авторизація... зачекайте</h2>
        </div>
    );
}

export default Oauth2GoogleCallback;