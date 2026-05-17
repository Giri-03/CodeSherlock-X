import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://codesherlock-x.onrender.com";

export const api = axios.create({
  baseURL: API_URL,
});
