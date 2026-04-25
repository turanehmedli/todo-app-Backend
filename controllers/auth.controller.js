import { User } from "../modules/user.model.js";
import jwt from 'jsonwebtoken'
import {generateAccessToken, generateRefreshToken} from '../utils/generatorToken.js'


export const login = async (req, res)=>{
    try {
        const {email, password} =req.body;
        const user = await User.findOne({ email })
        if(!user){
            return res.status(404).json({message:"User Not Found"})
        }

        const isPassword = await user.matchPassword(password)
        if(!isPassword){
            return res.status(401).json({message:"Invalid Password"})
        }

        const accessToken = generateAccessToken(user, res);
        const refreshToken = generateRefreshToken(user, res)

        user.refreshToken = refreshToken
        await user.save()

        res.status(200).json({accessToken, refreshToken})
    } catch (error) {
        res.status(500).json({message:"Server error", error:error.message})
    }
}

export const register = async (req, res)=>{
    try {
        const {firstName, lastName, email, password}=req.body
        const newUser = new User({firstName, lastName, email, password})

        const accessToken = generateAccessToken(newUser, res)
        const refreshToken = generateRefreshToken(newUser, res)

        newUser.refreshToken = refreshToken
        await newUser.save();

        res.status(201).json({message:"User register successfully",accessToken, refreshToken})
    } catch (error) {
        res.status(500).json({message:"Server error", error:error.message})
    }
}

export const getUserInfo = async(req, res)=>{
    try {
        const user = await User.findById(req.user.id).select('-password -refreshToken')

        res.status(200).json({user})
    } catch (error) {
        res.status(500).json({message:"Server error", error:error.message})
    }
}

export const refreshToken = async(req, res)=>{
    try {
        const token = req.body.refreshToken || req.cookies.refreshToken
        const decode = jwt.verify(token, process.env.REFRESH_TOKEN)
        req.user = decode

        const user = await User.findById(decode.id)
        if(!user) return res.status(404).json({message:"User not found"})
        if(user.refreshToken !== token) return res.status(403).json({message:"Invalid Token"})

        const newAccessToken = generateAccessToken(user, res)

        res.status(200).json({accessToken:newAccessToken})
    } catch (error) {
        res.status(500).json({message:"Server error", error:error.message})
    }
}