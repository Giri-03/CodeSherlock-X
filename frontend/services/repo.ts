import { api } from "./api";
import axios from "axios";

export async function analyzeRepository(github_url: string) {
  try {
    const response = await api.post("/api/repo/analyze", { github_url });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.status);
      console.error("Axios response:", error.response?.data);
      console.error("Axios full error:", error);
    }
    throw error;
  }
}

export async function clearRepository(repo_id: string) {
  const response = await api.delete(`/api/repo/clear/${repo_id}`);
  return response.data;
}
