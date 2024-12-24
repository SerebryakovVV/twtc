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