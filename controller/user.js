const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const { checkAuthentication } = require('../services/user');

exports.signup = async (_, args) => {
    console.log("args", args);
    let { firstName, lastName, email, password } = args;
    let checkUser = await User.findOne({ email });
    console.log("checkUser", checkUser);
    if (checkUser) {
        throw new Error("Already exists! Please check your email");
    }
    password = await bcrypt.hash(password, 10);
    await User.create({ firstName, lastName, email, password });
    return "Signup successfully";
}

exports.login = async (_, args) => {
    let { email, password } = args;
    let checkUser = await User.findOne({ email });
    if (!checkUser) {
        throw new Error("Email not exist!");
    }
    let checkPassword = await bcrypt.compare(password, checkUser?.password);
    if (!checkPassword) {
        throw new Error("Password is incorrect!");
    }
    let token =  jwt.sign({id: checkUser._id}, process.env.JWT_SECRET_KEY);
    return {
        data: checkUser,
        message: "Login successfully",
        token
    };;
}

exports.getUsers = async (_, args) => {
    let users = await User.find();
    return users;
}

exports.getUserFindById = async (userId,context) => {
    await checkAuthentication(context?.token);
    let user = await User.findById(userId);
    return user;
}