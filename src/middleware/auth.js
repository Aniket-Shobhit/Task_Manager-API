const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req,res,next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'thisisthetoken');
        const user = await User.findOne({ id: decoded._id, 'tokens.token': token });

        if(!user) {
            throw new Error();
        }
        
        req.token = token;
        req.user = user;
        next();
        //console.log(token);
    } catch(e) {
        res.status(401).send({ error: 'Please authenticate.'});
    }

    // console.log('auth middleware');
    // next();
};

module.exports = auth;