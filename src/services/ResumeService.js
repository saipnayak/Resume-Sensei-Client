import axios from "axios";

const API = axios.create({
  baseURL: "https://resume-sensei-backend.onrender.com",
  timeout: 60000 
});

export const analyzeResume = (resumeText, file) => {
  const formData = new FormData();

  if (resumeText && resumeText.trim()) {
    formData.append("resumeText", resumeText);
  }

  if (file instanceof File) {
    formData.append("resumeFile", file);
  }

  
  return API.post("/api/resume/analyze", formData);
};
