import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();


// ✅ CORS CONFIG
app.use(
  cors({
    origin: "http://localhost:5173", // Vite frontend
    methods: ["GET", "POST"],
    credentials: true,
  })
);


// ✅ BODY PARSER
app.use(express.json());


// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend Running 🚀",
  });
});


// ✅ CHAT ROUTE
app.post("/api/chat", async (req, res) => {
  try {
    console.log("REQUEST BODY =>", req.body);

    const response = await fetch(
      "https://api.aicredits.in/v1/messages",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          "anthropic-version": "2023-10-05",

          Authorization: `Bearer ${process.env.AI_API_KEY}`,
        },

        body: JSON.stringify(req.body),
      }
    );

    // ✅ GET RAW TEXT
    const text = await response.text();

    console.log("RAW AI RESPONSE =>", text);

    // ✅ HANDLE NON-JSON ERRORS
    let data;

    try {
      data = JSON.parse(text);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: text,
      });
    }

    // ✅ SUCCESS RESPONSE
    return res.status(200).json(data);

  } catch (error) {
    console.log("BACKEND ERROR =>", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
});


// ✅ PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});