import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

export async function sendMessage(payload) {
  const res = await axios.post(`${API_BASE}/chat`, payload);
  return res.data;
}
