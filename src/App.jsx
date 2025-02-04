import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { saveAs } from "file-saver"; // For downloading DOC file

export default function App() {
  const [file, setFile] = useState(null);
  const [transcriptId, setTranscriptId] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [summary, setSummary] = useState("");
  const [status, setStatus] = useState("");
  const [showGenerateSummary, setShowGenerateSummary] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    if (transcription) {
      setStatus("Completed");
      setShowGenerateSummary(true);
    }
  }, [transcription]);

  useEffect(() => {
    if (summary) {
      setShowSummary(true);
    }
  }, [summary]);

  //  Configure file upload with dropzone
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "audio/mp3": [".mp3"],
      "audio/wav": [".wav"],
      "audio/m4a": [".m4a"],
      "audio/ogg": [".ogg"],
      "audio/flac": [".flac"],
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        console.log("File selected:", acceptedFiles[0]);
        setFile(acceptedFiles[0]);
      }
    },
  });

  //  Upload and Transcribe Audio
  const handleUpload = async () => {
    if (!file) {
      alert("Please upload an audio file.");
      return;
    }

    const formData = new FormData();
    formData.append("audio", file);

    console.log("Uploading file:", file);

    try {
      const response = await axios.post("http://localhost:5000/transcribe", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTranscriptId(response.data.transcriptId);
      setStatus("Processing...");
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  // Check Transcription Status
  const checkStatus = async () => {
    if (transcriptId === null) return;
    try {
      const response = await axios.get(`http://localhost:5000/transcription/${transcriptId}`);
      console.log("API Response:", response.data);

      if (response.data.status === "completed") {
        setTranscription(response.data.transcription || "No transcription available");
        setShowGenerateSummary(true);
      } else {
        setStatus(response.data.status);
      }
    } catch (error) {
      console.error("Error checking transcription:", error);
    }
  };

  // Generate Summary from Transcription
  const generateSummary = async () => {
    if (!transcription) {
      alert("No transcription available to summarize.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/summarize", { text: transcription });
      console.log("Summary Response:", response.data);
      setShowSummary(true);
      setSummary(response.data.summary || "No summary available.");
    } catch (error) {
      console.error("Error generating summary:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6 text-center">Audio Transcriber</h1>

        
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-400 rounded-lg p-6 bg-gray-50 text-center cursor-pointer w-full"
        >
          <input {...getInputProps()} />
          <p className="text-gray-600">{file ? file.name : "Drag & drop an MP3/WAV file or click to upload"}</p>
        </div>

       
        <button
          onClick={handleUpload}
          className="mt-4 px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Upload & Transcribe
        </button>

      
        {transcriptId && (
          <div className="mt-4 flex flex-col items-center">
            <button
              onClick={checkStatus}
              className="px-5 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
            >
              Check Transcription Status
            </button>
            <p className="mt-2 text-gray-700 font-medium">{status}</p>
          </div>
        )}

        
        {transcription && (
          <div className="mt-6 w-full bg-gray-50 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-center">Transcription</h2>
            <p className="mt-2 text-gray-800 text-center">{transcription}</p>

            {showGenerateSummary && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={generateSummary}
                  className="px-5 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
                >
                  Generate Summary
                </button>
              </div>
            )}

        
            {showSummary && (
              <div className="mt-6">
                <h2 className="text-xl font-bold text-center">Summary</h2>
                <ul className="mt-2 text-gray-800 text-center">
                  {summary.split("\n").map((item, index) => (
                    <li key={index} className="list-disc pl-6">{item}</li>
                  ))}
                </ul>

             
                <div className="mt-4 flex justify-center space-x-4">
                  <button
                    onClick={() =>
                      saveAs(
                        new Blob([`Transcription:\n${transcription}\n\nSummary:\n${summary}`], { type: "text/plain" }),
                        "transcription.txt"
                      )
                    }
                    className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                  >
                    Export to .txt
                  </button>
                  <button
                    onClick={() => {
                      const docContent = `<html><head><title>Transcription</title></head><body>
                      <h1>Transcription</h1><p>${transcription}</p><h2>Summary</h2><ul>
                      ${summary.split("\n").map((item) => `<li>${item}</li>`).join("")}</ul></body></html>`;
                      saveAs(new Blob([docContent], { type: "application/msword" }), "transcription.doc");
                    }}
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                  >
                    Export to .doc
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
