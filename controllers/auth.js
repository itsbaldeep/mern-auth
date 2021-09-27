const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

// Register Controller
// Creates a new user and responds with a new JWT token
exports.register = async (req, res, next) => {
    const { username, email, password } = req.body;
    try {
        const user = await User.create({
            username,
            email,
            password,
        });
        sendToken(user, 201, res);
    } catch (error) {
        next(error);
    }
};

// Login Controller
// Responds with a token
exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorResponse("Please provide email and password", 400));
    }

    try {
        // Getting the users password
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return next(new ErrorResponse("Invalid credentials", 401));
        }

        // Comparing the users password
        const isMatched = await user.matchPasswords(password);
        if (!isMatched) {
            return next(new ErrorResponse("Invalid credentials", 401));
        }

        // Success response
        sendToken(user, 200, res);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

// Forgot Password Controller
exports.forgotPassword = async (req, res, next) => {
    const { email } = req.body;

    try {
        // Verifying that the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return next(new ErrorResponse("The email couldn't be sent", 404));
        }

        // Generating a reset token and saving changes to the DB
        const resetToken = user.getResetToken();
        await user.save();

        // Generating a reset password url and the email message
        const resetUrl = `http://localhost:3000/resetpassword/${resetToken}`;
        const message = `
            <h1>You have requested to reset your password</h1>
            <p>Please go to this link to reset</p>
            <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        `;

        // Sending the email to the user
        try {
            await sendEmail({
                to: user.email,
                subject: "Password Reset Request",
                text: message,
            });
            res.status(200).json({
                success: true,
                data: "Email sent",
            });
        } catch (error) {
            // In case of an error, reset the token and expire and save changes to the DB
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return next(new ErrorResponse("Email couldn't be sent", 500));
        }
    } catch (error) {
        next(error);
    }
};

// Reset Password Controller
exports.resetPassword = async (req, res, next) => {
    // Create a token
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");
    try {
        // Finding the user based on the token
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });
        if (!user) return next(new ErrorResponse("Invalid Reset Token", 400));

        // Resetting the password and saving changes
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        return res.status(201).json({
            success: true,
            data: "Password resetted successfully",
        });
    } catch (error) {
        next(error);
    }
};

// This function generates a new JWT token
const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken();
    res.status(statusCode).json({
        success: true,
        token,
    });
};
