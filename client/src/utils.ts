import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setJwtRedux } from "./features/auth/authSlice";


export const imgResToObjUrl = (imgData: string | Array<number>) => {
    let uint8ArrayImg;
    if (typeof imgData === "string") {
        imgData = imgData.slice(2);
        uint8ArrayImg = new Uint8Array(imgData.length / 2);
        for (let i = 0; i < imgData.length; i++) {
            uint8ArrayImg[i] = parseInt(imgData.substring(i * 2, i * 2 + 2), 16)
        }
    } else {
        uint8ArrayImg = new Uint8Array(imgData);
    }
    const blobImg = new Blob([uint8ArrayImg], {type: "image/png"})
    return URL.createObjectURL(blobImg);
}


export const timestampTransform = (ts: string) => {
    const date = new Date(ts);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
}


export const useJwtFetch = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    return async (path: RequestInfo | URL, options: RequestInit) => {
        const response = await fetch(path, options);
        if (response.ok) return response;
        console.log(response.status)
        if (response.status === 401) {
            console.log("access 1 failed")
            navigate("/login");
            throw new Error("failed to authorize");
        }
        if (response.status === 403) {
            const refreshResponse = await fetch("http://localhost:3000/refresh", {credentials:"include"});
            console.log("start refresh");
            if (refreshResponse.status === 200) {
                console.log("refresh good");
                const newAccessToken = await refreshResponse.text();
                dispatch(setJwtRedux(newAccessToken));
			    localStorage.setItem("accessToken", newAccessToken);
                return await fetch(path, {...options, headers:{...options.headers,"authorization":"Bearer " + newAccessToken}});
            } 
            console.log("navigate");
            navigate("/login");
            throw new Error("failed to refresh");
        }
        throw new Error("failed to check access");
    }
}