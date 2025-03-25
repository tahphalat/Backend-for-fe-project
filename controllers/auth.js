const User = require('../models/User');

exports.register = async (req, res, next) => {
    try {
  
        const { name, telephone_number, email, password, role } = req.body;
        //Create user
        const user = await User.create({
            name,
            telephone_number,
            email,
            password,
            role
        });
        // const token = user.getSignedJwtToken();
        // res.status(200).json({success:true,token});
        sentTokenResponse(user, 200, res);
    } catch (err) {
        res.status(400).json({ success: false });
        console.log(err.stack);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        //Validate email & password
        if (!email || !password) {
            return res.status(400).json({ success: false, msg: 'Please provide an email and password' });
        }

        //Check for user
        const user = await
            User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, msg: 'Invalid credentials' });
        }

        //Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(400).json({ success: false, msg: 'Invalid credentials' });
        }

        //create token
        // const token = user.getSignedJwtToken();
        // res.status(200).json({success:true,token});
        sentTokenResponse(user, 200, res);
    } catch (err) {
        return res.status(401).json({ success: false, msg: 'Cannot convert email or password to string' });
    }

};
//get token from model, create cookie and send response
const sentTokenResponse = (user, statusCode, res) => {
    //Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res.status(statusCode).cookie('token', token, options).json({ success: true, _id: user._id,
        name: user.name,
        email: user.email,
        telephone: user.telephone,
        role: user.role,
         token });
};

exports.getMe = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        data: user
    });
};

exports.logout = async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({
        success: true,
        data: {}
    });
};
exports.updateUser = async (req, res, next) => {
    try {
        let user = await User.findById(req.params.id);
        
            if (!user) {
                    return res.status(404).json({
                        success: false,
                        message: `No user with the id of ${req.param.id}`
                    });
                }
        
                if (user.id.toString() !== req.user.id) {
                    return res.status(401).json({ success: false, message: `User ${req.params.id} is not authorized to update this user` });
                }
                user = await User.findByIdAndUpdate(req.params.id, req.body, {
                    new: true,
                    runValidators: true
                });
                res.status(200).json({
                    success: true,
                    data: user
                });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};