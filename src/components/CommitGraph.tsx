import React, { useEffect, useState } from "react";
import getCommitsGroupedByDate from "../api/overviewApi";

interface IProps {
  username: string;
}

const CommitGraph: React.FC<IProps> = ({ username }) => {
  const [commitsByDate, setCommitsByDate] = useState<any>({});  // 초기값 비어 있는 객체
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommitsGroupedByDate = async (username: string) => {
      try {
        const result = await getCommitsGroupedByDate(username);
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

  // 커밋 수를 기준으로 색상 계산
  const getColorForCommitCount = (commitCount: number) => {
    if (commitCount === 0) return 'bg-gray-200';  // 커밋 없음
    if (commitCount <= 5) return 'bg-green-100';  // 적은 커밋
    if (commitCount <= 10) return 'bg-green-300'; // 중간 커밋
    if (commitCount <= 20) return 'bg-green-500'; // 많은 커밋
    return 'bg-green-700';  // 매우 많은 커밋
  };

  // 커밋 날짜를 순서대로 정렬
  const dates = Object.keys(commitsByDate);
  const sortedDates = dates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  // 그리드에 날짜 배치: 7일씩 묶어서 행을 구성
  const weeks = [];
  for (let i = 0; i < sortedDates.length; i += 7) {
    weeks.push(sortedDates.slice(i, i + 7));
  }

  return (
    <div>
      <h3>Commits Grouped By Date (Last 1 Year)</h3>
      <div className="grid grid-cols-7 gap-1">
        {/* 그리드에 커밋 날짜를 넣기 */}
        {weeks.map((week, weekIndex) => (
          <>
            {week.map((date, index) => {
              const commitCount = commitsByDate[date] ? commitsByDate[date].length : 0;
              const dayOfWeek = new Date(date).getDay();
              const emptyCells = weekIndex === 0 && index === 0 ? dayOfWeek : 0;

              return (
                <>
                  {emptyCells > 0 && [...Array(emptyCells)].map((_, idx) => (
                    <div key={`empty-${idx}`} className="h-10"></div>
                  ))}
                  <div
                    key={date}
                    className={`flex flex-col items-center justify-end p-1 h-10 ${getColorForCommitCount(commitCount)}`}
                    title={`${date}: ${commitCount} commits`}
                  >
                    <span className="text-xs">{new Date(date).getDate()}</span>
                  </div>
                </>
              );
            })}
          </>
        ))}
      </div>
    </div>
  );
};

export default CommitGraph;
