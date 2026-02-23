import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../services/Api/authSlice.tsx";
import { useEffect } from "react";

const Oauth2GoogleCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();

    useEffect(() => {
        const accessToken = searchParams.get("accessToken");
        const refreshToken = searchParams.get("refreshToken");

        if (accessToken && refreshToken) {
            dispatch(setCredentials({ 
                accessToken, 
                refreshToken,
                user: null 
            }));

            navigate("/", { replace: true });
        } else {
            console.error("Auth failed: Tokens not found in URL");
            navigate("/login");
        }
    }, [searchParams, dispatch, navigate]);

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <h2>Авторизація... зачекайте</h2>
        </div>
    );
}

export default Oauth2GoogleCallback;