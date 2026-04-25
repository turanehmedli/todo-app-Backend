import jwt from 'jsonwebtoken'

export const protect =(req, res, next)=>{
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith("Bearer")){
        return res.status(401).json({message:"Unauthorized"})
    }

    const token = authHeader.split(" ")[1] || req.cookies.accessToken
    try {
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN)
        req.user = decode
        next()
    } catch (error) {
        return res.status(401).json({message:"Invalid token"})
    }
}

export const isAdmin = (req, res, next)=>{
    try {
        if(req.user && req.user.role ==="admin"){
            return next()
        }

        return res.status(403).json({message:"Unauthorized, admin only"})
    } catch (error) {
        return res.status(403).json({ message:"Unauthorized, admin only" });
    }
}