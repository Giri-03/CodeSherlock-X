import { api } from "./api";

export async function analyzeDebt(
  repo_id: string
) {

  const response = await api.post(
    "/api/tests/technical-debt",
    {
      repo_id,
    }
  );

  return response.data;
}