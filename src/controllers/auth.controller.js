const userModel = require ("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");


async function postRegisterController(req, res){

    const {email, password, fullName:{firstName, lastName}} = req.body;


    const isUserExist = await userModel.findOne({
        email
    })

    if(isUserExist){
        return res.status(400).json({
            message:"User is already exist"
        })
    }

    const hashPassword = await bcrypt.hash(password, 10);


    const user = await userModel.create({
        email,
        password: hashPassword,
        fullName:{
            firstName, lastName
        }
    })


    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET);

    res.cookie("token", token);

    res.status(201).json({
        message:"user registerd",
        user: {
            email: user.email,
            _id: user._id,
            fullName: user.fullName
        }
    })
    
}



async function postLoginController(req, res){

    const {email, password} = req.body;

    user = await userModel.findOne({
        email
    })

    if(!user){
        return res.status(400).json({
            message:"email or password is invalid"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET);


    res.cookie("token", token);


    res.status(200).json({
        message: "user logged in successfully",
        user: {
            email: user.email,
            _id: user._id,
            fullName: user.fullName
        }
    })

}



module.exports = {
    postRegisterController,
    postLoginController
}