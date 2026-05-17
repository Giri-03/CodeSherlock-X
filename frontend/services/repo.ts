import { api } from "./api";

export async function analyzeRepository(github_url: string) {
  const response = await api.post("/api/repo/analyze", { github_url });
  return response.data;
}

export async function clearRepository(repo_id: string) {
  const response = await api.delete(`/api/repo/clear/${repo_id}`);
  return response.data;
}
