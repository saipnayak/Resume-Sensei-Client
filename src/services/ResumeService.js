import axios from "axios";



const API = axios.create({
  baseURL: "https://resume-sensei-backend.onrender.com/"
});

export const analyzeResume = (resumeText, file) => {
  const formData = new FormData();
  if (resumeText) formData.append("resumeText", resumeText);
  if (file) formData.append("resumeFile", file);

  return API.post("/api/resume/analyze", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};


