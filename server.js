import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();


// ✅ ALLOWED FRONTEND URLS
const allowedOrigins = [
  "http://localhost:5173",
  "https://kisan-college-ai.vercel.app",
];


// ✅ CORS CONFIG
app.use(
  cors({
    origin: function (origin, callback) {

      // ✅ ALLOW POSTMAN / MOBILE APPS / SERVER REQUESTS
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(
          new Error("Not allowed by CORS")
        );
      }
    },

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

    // ✅ RAW RESPONSE
    const text = await response.text();

    console.log("RAW AI RESPONSE =>", text);

    let data;

    try {
      data = JSON.parse(text);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: text,
      });
    }

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