import React, { useState } from "react";
import axios from "axios";

const useAuth = (code) => {
    const [accessToken, setAccessToken] = useState();
    const [refreshToken, setRefreshToken] = useState();
    const [expireIn, setExpireIn] = useState();

    useEffect(() => {
        axios
            .post("http://localhost:3001/login", {
                code,
            })
            .then((res) => {
                setAccessToken(res.data.accessToken);
                setRefreshToken(res.data.refreshToken);
                setExpireIn(res.data.expireIn);
                // ทำให้ user-code ใน url ไม่แสดง
                window.history.pushState({}, null, "/");
            })
            .catch(() => {
                window.location = "/";
            })
    }, [code]);

    return accessToken;
};

export default useAuth;
