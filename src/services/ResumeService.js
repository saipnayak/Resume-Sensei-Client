import axios from 'axios'

const API_BASE = 'http://localhost:8080'
const client = axios.create({ baseURL: API_BASE, timeout: 15000 })

const analyzeResume = async (resumeText) => {
    const resp = await client.post('/api/resume/analyze', { resumeText })
    return resp.data
}

export default { analyzeResume }
