require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

//  Step 1: Upload Audio & Send to AssemblyAI
app.post("/transcribe", upload.single("audio"), async (req, res) => {
    try {
        const filePath = req.file.path;

        // Upload audio file to AssemblyAI
        const uploadResponse = await axios.post(
            "https://api.assemblyai.com/v2/upload",
            fs.createReadStream(filePath),
            { headers: { "authorization": ASSEMBLYAI_API_KEY } }
        );

        const audioUrl = uploadResponse.data.upload_url;

        // Send for transcription
        const transcribeResponse = await axios.post(
            "https://api.assemblyai.com/v2/transcript",
            { audio_url: audioUrl },
            { headers: { "authorization": ASSEMBLYAI_API_KEY, "Content-Type": "application/json" } }
        );

        const transcriptId = transcribeResponse.data.id;

        
        res.json({ transcriptId });

        // Cleanup: Remove stored audio file
        fs.unlinkSync(filePath);
    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/transcription/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch transcription from AssemblyAI
        const response = await axios.get(
            `https://api.assemblyai.com/v2/transcript/${id}`,
            {
                headers: { "authorization": ASSEMBLYAI_API_KEY }
            }
        );

        // If transcription is completed, return transcription & status
        if (response.data.status === "completed") {
            return res.json({
                status: "completed",
                transcription: response.data.text || "No transcription available."
            });
        }

        //  If transcription is still in progress, return the current status
        return res.json({ status: response.data.status });

    } catch (error) {
        console.error("Error fetching transcript:", error.response?.data || error.message);

        
        res.status(500).json({ 
            status: "error", 
            error: "Internal server error" 
        });
    }
});



//  Step 3: Generate Summary from Transcription
app.post("/summarize", async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: "No transcription text provided." });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Summarize this transcription in bullet points but donot use any seprator like '-' or '*' in begining.:\n\n"${text}"`;

        const result = await model.generateContent(prompt);
        const summary = result.response.candidates[0].content.parts[0].text;

        res.json({ summary });
    } catch (error) {
        console.error("Error generating summary:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to generate summary." });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
