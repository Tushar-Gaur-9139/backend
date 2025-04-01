const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

// Load environment variables from .env file
dotenv.config();

// Use the port from the .env file or default to 5000
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json()); // Parse JSON bodies (as sent by API clients)

const emailRoutes = require("./routes/routes");
const formRoutes = require("./routes/formRoutes"); // Import the form routes
app.use("/api", emailRoutes);
app.use("/api", formRoutes); // Use the form routes under the /api path
 // Use the email routes under the /api path

app.get('/', (req, res) => {
    res.send("server running perfectly");
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});