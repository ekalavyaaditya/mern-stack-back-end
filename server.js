const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(morgan("dev"));
connectDB();

app.use(express.json({ extended: false }));
app.use("/api/users", require("./routes/userRoute"));
app.use("/api/products", require("./routes/productRoute"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/profile", require("./routes/profileapi"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/payment", require("./routes/payment"));
app.get("/", (req, res) => {
    res.send(`app is working PORT number ${PORT}`);
});

app.listen(PORT, () => {
    console.log(`serve is listing at port ${PORT}`)
});