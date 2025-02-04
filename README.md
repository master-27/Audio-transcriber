# 🎤 Voice Note Transcriber

A web application that **transcribes audio files into text** and **summarizes the text using AI**.  
Supports **MP3, WAV, M4A, OGG, FLAC** file formats and provides **export options** in `.txt` and `.doc` formats.

## ✨ Features
- Upload **audio files** and convert them to text.
- **Check transcription status** in real-time.
- Generate a **summary** using **Google Gemini AI**.
- Download **transcription & summary** as `.txt` or `.doc`.
- Clean **UI with Tailwind CSS**.
  
---

## 🚀 Tech Stack
### **Frontend**
- **React.js** (Vite)
- **Tailwind CSS** (for styling)
- **Axios** (for API requests)
- **React Dropzone** (for file uploads)
- **FileSaver.js** (for exporting files)

### **Backend**
- **Node.js & Express.js** (server)
- **Multer** (for handling file uploads)
- **AssemblyAI API** (for speech-to-text conversion)
- **Google Gemini API** (for generating summaries)
- **Cors & dotenv** (for security and configuration)

---

## 🛠️ Setup & Installation

### 1️⃣ **Clone the Repository**
```bash
git clone https://github.com/YOUR_USERNAME/voice-transcriber.git
cd voice-transcriber
```

### 2️⃣ **Backend Setup**
```bash
cd backend
npm install
```

### 3️⃣ **Setup Environment Variables**
Create a **`.env`** file in the `backend` folder:
```ini
ASSEMBLYAI_API_KEY=your_assemblyai_api_key
GEMINI_API_KEY=your_google_gemini_api_key
```

### 4️⃣ **Run the Backend**
```bash
node server.js
```
_Backend starts on: **`http://localhost:5000`**_

---

### 5️⃣ **Frontend Setup**
```bash
cd frontend
npm install
```

### 6️⃣ **Run the Frontend**
```bash
npm run dev
```
_App runs on: **`http://localhost:5173`**_

---

## 📌 How to Use?
1. **Upload an audio file** (MP3, WAV, M4A, OGG, FLAC).
2. Click **"Upload & Transcribe"**.
3. Wait for **transcription to complete**.
4. Click **"Generate Summary"** (optional).
5. Download the transcription as `.txt` or `.doc`.

---

## 🔥 API Endpoints
### **1️⃣ Upload & Transcribe Audio**
**POST** `/transcribe`  
_Send an audio file & receive a transcription ID._  
```json
{ "transcriptId": "12345" }
```

### **2️⃣ Check Transcription Status**
**GET** `/transcription/:id`  
_Response:_
```json
{
  "status": "completed",
  "transcription": "This is the transcribed text."
}
```

### **3️⃣ Generate Summary**
**POST** `/summarize`  
_Request:_
```json
{ "text": "This is a transcribed text." }
```
_Response:_
```json
{ "summary": "- Key point 1\n- Key point 2" }
```

---

## 🎯 Future Enhancements
- Live **real-time transcription**.
- Speaker **diarization** (identify different speakers).
- Multi-language **translation support**.

---

## 📝 License
This project is **MIT Licensed**.

---

## 👨‍💻 Author & Credits
- **Developed by:** [Your Name](https://github.com/YOUR_USERNAME)
- **AssemblyAI API** - Speech-to-Text
- **Google Gemini API** - Summarization

---

## ⭐ Contributions & Support
💡 Feel free to **fork this repo** and submit a **pull request**!  
📧 For any queries, contact: **your.email@example.com**

---
🚀 **Now, you're all set to build & deploy!**  
---
