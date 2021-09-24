require("dotenv").config({ path: "./config.env" });
const express = require("express");
const connectDB = require("./config/db");

connectDB();
const app = express();
app.use(express.json());
app.use("/api/auth", require("./routes/auth"));

const PORT = process.env.PORT || 80;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// process.on("unhandledRejection", (err, promise) => {
//     console.error(`Unhandled Rejection Error: ${err}`);
//     server.close(() => process.exit(1));
// });
