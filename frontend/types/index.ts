export interface RepoAnalysisResponse {
  repo_id: string;
  framework: string;
  directory_tree: string;
  important_files: string[];
  bob_analysis: any;
}