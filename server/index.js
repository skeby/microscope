const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(
  "mongodb+srv://akinsanyaadeyinka4166:ESHCGE2jux0fAp2M@microscope.5hqt0gc.mongodb.net/?retryWrites=true&w=majority&appName=microscope",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const conversionSchema = new mongoose.Schema({
  username: String,
  microscopeSize: Number,
  magnification: Number,
  originalSize: Number,
  submittedAt: { type: Date, default: Date.now },
});

const Conversion = mongoose.model("Conversion", conversionSchema);

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", async (req, res) => {
  res
    .status(200)
    .json({
      status: "success",
      message: "Home route for microscope conversion api",
    });
});

// POST: handle form conversion
app.post("/api/submit", async (req, res) => {
  try {
    const data = new Conversion(req.body);
    await data.save();
    res.status(201).json({ message: "Conversion saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET: fetch all conversions
app.get("/api/conversions", async (req, res) => {
  try {
    const conversions = await Conversion.find().sort({ submittedAt: -1 });
    res.json(conversions);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch conversions" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
