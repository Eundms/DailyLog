import React, { useEffect, useState } from "react";
import getCommitsGroupedByDate from "../api/overviewApi";
import { Commit } from "../types/types";
import "../styles/contributiongroupedbydate.css";

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
        const result = (await getCommitsGroupedByDate(username)) as Record<string, Commit[]>;
        console.log(result);
        if (result) { 
          setCommitsByDate(result);
        }
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
      <h3>Daily Logs</h3>
      <ul>
        {Object.keys(commitsByDate).map((date) => (
          <li key={date}>
            <h4>{date}</h4>
              <div className="log-container">
              {commitsByDate[date].map((commit, index) => (
                  <div  key={commit.sha || index}>
                    <div ><span className="log-time"> </span><span className="repository"> {commit.repository}</span></div>
                    <div className="log-message"><span className="log-time"> Message :</span> <span className="log-detail">{commit.commit.message}</span></div>
                  </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommitsGroupedByDate;
