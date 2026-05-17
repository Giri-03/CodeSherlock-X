import { api } from "./api";

export async function analyzePR(pr_url: string) {
  const response = await api.post("/api/pr/analyze", { pr_url });
  return response.data;
}

export async function clearPRResult(pr_id: string) {
  const response = await api.delete(`/api/pr/clear/${pr_id}`);
  return response.data;
}

export async function clearAllPRResults() {
  const response = await api.delete("/api/pr/clear");
  return response.data;
}
