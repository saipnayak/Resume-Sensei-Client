import axios from "axios";



const API = axios.create({
  baseURL: "https://resume-sensei-backend.onrender.com/"
});

export const analyzeResume = (resumeText) => {
  return API.post("/api/resume/analyze", {
    resumeText
  });
};

