
import { getUser } from "../services/jwt.service.js"

const authenticationMiddleware =async(req, res, next)=>{
    const token=req.headers.authorization?.split(' ')[1]
    if(!token) return res.status(401).json({message:"Unauthorized"})
    try {
        const decoded=await getUser(token)
        req.user=decoded
        next()
    } catch (error) {
        console.error(error)
        return res.status(401).json({message:"Invalid token"})
    }
}

export default authenticationMiddleware