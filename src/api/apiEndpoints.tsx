export const GITHUB_API = {
  REPOS: (username: string) => `/users/${username}/repos`,
  COMMITS: (username: string, repoName: string) => `/repos/${username}/${repoName}/commits`,
};
