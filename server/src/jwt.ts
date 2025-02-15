import jwt from 'jsonwebtoken';

export const generateAccessJwt = (data: {username:string, id:string}) => jwt.sign(data, String(process.env.JWT_ACCESS_SECRET), {expiresIn:"15m"});
export const generateRefreshJwt = (data: {username:string, id:string}) => jwt.sign(data, String(process.env.JWT_REFRESH_SECRET), {expiresIn:"15d"});