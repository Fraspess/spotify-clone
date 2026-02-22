import {useNavigate, useSearchParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import {setCredentials} from "../../services/Api/authSlice.tsx";
import {useEffect} from "react";

const Oauth2GoogleCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();

    useEffect(() => {
        const accessToken = searchParams.get("accessToken");
        const refreshToken = searchParams.get("refreshToken");

        // dispatch(setCredentials({ accessToken, refreshToken }));

        navigate("/", { replace: true });
    }, [searchParams, dispatch, navigate]);

    return <div>Loading...</div>;
}


export default Oauth2GoogleCallback;