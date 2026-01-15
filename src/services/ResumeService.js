import axios from "axios";



const API = axios.create({
  baseURL: "http://localhost:8080"
});

export const analyzeResume = (resumeText) => {
  return API.post("/api/resume/analyze", {
    resumeText
  });
};

