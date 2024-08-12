const mongoose = require("mongoose");
const config = require("./keys");
const db = config.mongoURL;

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("Connected to the database");
  } catch (err) {
    console.error("Connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
