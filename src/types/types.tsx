// types.ts

export interface CommitAuthor {
  name: string;
  email: string;
  date: string;
}

export interface Commit {
  sha: string;
  commit: {
    author: CommitAuthor;
    committer: CommitAuthor;
    message: string;
    date: string;
  },
  repository : string;
}

export interface Repo {
  name: string;
  owner: {
    login: string;
  };
}

export interface CommitResponse {
  sha: string;
  commit: {
    author: CommitAuthor;
    committer: CommitAuthor;
    message: string;
    date: string;
  };
}
