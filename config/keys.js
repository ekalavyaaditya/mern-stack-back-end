require('dotenv').config();
module.exports={
    mongoURL: process.env.MONGO_URL,
    jwtSecret: process.env.JWT_SECRET,
}