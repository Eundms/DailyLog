import React, { useEffect, useState } from "react";
import getCommitsGroupedByDate from "../api/overviewApi";
import { Commit } from "../types/types";

interface IProps {
  username: string;
}

const CommitsGroupedByDate: React.FC<IProps> = ({ username }) => {
  const [commitsByDate, setCommitsByDate] = useState<Record<string, Commit[]>>({});  // 초기값은 빈 객체
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommitsGroupedByDate = async (username: string) => {
      try {
        const result = await getCommitsGroupedByDate(username);
        console.log(result);
        setCommitsByDate(result); // 커밋 데이터 업데이트
      } catch (error: any) {
        setError(error.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchCommitsGroupedByDate(username);
    }
  }, [username]);

  if (loading) return <div>Loading commits...</div>;
  if (error) return <div>Error: {error}</div>;

  // commitsByDate가 비어 있지 않은지 확인
  if (Object.keys(commitsByDate).length === 0) {
    return <div>No commits found for the given username.</div>;
  }

  return (
    <div>
      <h3>Commits Grouped By Date (Last 1 Year)</h3>
      <ul>
        {Object.keys(commitsByDate).map((date) => (
          <li key={date}>
            <h4>{date}</h4>
            <ul>
              {commitsByDate[date].map((commit, index) => (
                <li key={commit.sha || index}>
                  <p><strong>Message:</strong> {commit.commit.message}</p>
                  <p><strong>Author:</strong> {commit.commit.author.name}</p>
                  <p><strong>Date:</strong> {commit.commit.committer.date}</p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommitsGroupedByDate;
