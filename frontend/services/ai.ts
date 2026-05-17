import { api } from "./api";

export async function askRepository(
  repo_id: string,
  question: string
) {
  const response = await api.post(
    "/api/chat/ask",
    {
      repo_id,
      question,
    }
  );

  return response.data;
}