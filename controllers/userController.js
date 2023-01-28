const User = require("../modals/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Get admins List
const getUserDetails = asyncHandler(async (req, res) => {
    const { token } = req.body;
    const JWT_sec = process.env.JWTSEC;
    const tok2usr = jwt.verify(token, JWT_sec);
    const id = tok2usr.id;
    const user = await User.findById(id).select("-password");
    if (!user) {
        return res.status(400).json({ message: "No user available" });
    }
    const users = await User.find().select("-password");
    res.json(users);
})


//Login
const userLogin = asyncHandler(async (req, res) => {
    const { emailId, password, isLogin } = req.body;
    if (isLogin) {
        const user = await User.find({ emailId });
        console.log(user);
        if (!user || user.length === 0) {
            return res.status(400).json({ message: "User not available" });
        }
        if (await bcrypt.compare(password, user[0].password)) {
            const JWT_sec = process.env.JWTSEC;
            const token = jwt.sign({ id: user[0].id, emailId: user[0].emailId }, JWT_sec);

            let obj = {
                "firstName": user[0].firstName,
                "lastName": user[0].lastName,
                "age": user[0].age,
                "mobileNumber": user[0].mobileNumber,
                "emailId": emailId,
                "access_token": token,
            }

            return res.status(200).json({ response: obj, message: "Login Success" });
        }
        else {
            return res.status(401).json({ message: "Invalid Credentials" });
        }
    }
    else {
        const user = await User.find({ emailId });
        if (user.length > 0) {
            return res.status(400).json({ message: "User already available" });
        }
        hashedPassword = await bcrypt.hash(password, 10);
        let userObject = {
            "emailId": emailId,
            "password": hashedPassword
        };
        const newUser = await User.create(userObject);
        if (newUser) {
            res.status(200).json({ message: `New User ${newUser.emailId} created` });
        }
        else {
            res.status(400).json({ message: "Invalid user data recieved" });
        }
    }

})

//Profile update
const updateUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, mobileNumber, emailId, age, token } = req.body;
    const JWT_sec = process.env.JWTSEC;
    const tok2usr = jwt.verify(token, JWT_sec);
    const usr_email = tok2usr.emailId;
    const userObject = {
        firstName, lastName, mobileNumber, emailId, age
    };

    if (Boolean(firstName) && Boolean(lastName) && Boolean(mobileNumber) && Boolean(emailId) && Boolean(age)) {
        const user = User.findOneAndUpdate({ "email": usr_email }, { "$set": userObject }).exec((err, data) => {
            if (err)
                return res.status(500).json({ message: `err ${err}` });
            else
                return res.status(200).json({ message: "The update has been recorded", profile: data });

        });
    }
    else
        return res.status(500).json({ message: "All fields are required" });
})


//Delete Profile/Account
const deleteUser = asyncHandler(async (req, res) => {
    const { token } = req.body;
    const JWT_sec = process.env.JWTSEC;
    const tok2usr = jwt.verify(token, JWT_sec);
    const id = tok2usr.id;
    if (!id) {
        return res.status(400).json({ message: "User ID required" });
    }
    const user = await User.findById(id).exec();
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }
    const result = await user.deleteOne();
    res.json({ message: `Userame ${result.emailId} with ID ${result.id} deleted` });
})


module.exports = { getUserDetails, userLogin, updateUser, deleteUser };