// utils/auth.js
import jwt from 'jsonwebtoken'

export function verifyToken(req) {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
        return null
    }

    try {
        return jwt.verify(token, process.env.NEXT_JWT_SECRET)
    } catch (error) {
        return null
    }
}