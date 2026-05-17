import { api } from "./api";

export async function generateDocs(
  repo_id: string,
  doc_type: string
) {
  const response = await api.post(
    "/api/docs/generate",
    {
      repo_id,
      doc_type,
    }
  );

  return response.data;
}