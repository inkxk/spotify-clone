import React, { useState, useEffect } from "react";
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

    // refreshToken ก่อนถึงเวลา expire 1 นาที
    useEffect(() => {
        // ถ้าไม่มี 2 ตัวนี้ return ออกเลย
        if (!refreshToken || !expireIn) return

        // setTimeout run 1 ครั้ง
        // setInterval run ทุกครั้งที่เกิด useEffect
        const interval = setInterval(() => {
            axios
            .post("http://localhost:3001/refresh", {
                refreshToken,
            })
            .then((res) => {
                setAccessToken(res.data.accessToken);
                setExpireIn(res.data.expireIn);
            })
            .catch(() => {
                window.location = "/";
            })
        }, (expireIn - 60) * 1000)
        return () => clearInterval(interval);
        
    }, [refreshToken, expireIn])
    
    return accessToken;
};

export default useAuth;
