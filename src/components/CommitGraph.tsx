import React, { useEffect, useState } from "react";
import getCommitsGroupedByDate from "../api/overviewApi";

interface IProps {
  username: string;
}

const CommitGraph: React.FC<IProps> = ({ username }) => {
  const [commitsByDate, setCommitsByDate] = useState<any>({});
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

  if (Object.keys(commitsByDate).length === 0) {
    return <div>No commits found for the given username.</div>;
  }

  const getColorForCommitCount = (commitCount: number) => {
    if (commitCount === 0) return "bg-gray-200";
    if (commitCount <= 5) return "bg-green-100";
    if (commitCount <= 10) return "bg-green-300";
    if (commitCount <= 20) return "bg-green-500";
    return "bg-green-700";
  };

  // 오늘 날짜를 기준으로 30주 전 날짜 계산
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 20 * 7); // 30주 전 날짜 계산

  // 날짜를 주별로 나누기 (일요일부터 시작)
  const weeks: (string | null)[][] = [];
  let currentWeek: (string | null)[] = Array(7).fill(null);

  // 주별 날짜 계산
  let currentDate = startDate;
  while (currentDate <= today) {
    const dayIndex = (currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1); // 일요일은 6으로, 나머지는 월요일부터 토요일까지 0-5
    currentWeek[dayIndex] = currentDate.toISOString().split("T")[0]; // 날짜를 ISO 형식으로 저장

    // 일요일이면 새로운 주 시작
    if (dayIndex === 6) {
      weeks.push(currentWeek);
      currentWeek = Array(7).fill(null); // 새 주로 초기화
    }

    // 날짜를 하루씩 증가
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // 마지막 주가 아직 채워지지 않았다면 추가
  if (currentWeek.some((day) => day !== null)) {
    weeks.push(currentWeek);
  }

  return (
    <div className="p-4">
      <h3 className="text-xl font-bold mb-4">Commits Grouped By Date (Last 20 Weeks)</h3>
      <div className="flex flex-wrap">
        {/* 요일 표시 (열로 표시) */}
        <div className="grid grid-rows-7 gap-2 mb-2 max-w-xs sm:max-w-none">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
            <div key={index} className="text-center font-bold text-sm">{day}</div>
          ))}
        </div>

        {/* 커밋 데이터 배치 (주별로) */}
        <div className="flex flex-wrap gap-2">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-2">
              {week.map((date, dayIndex) => {
                const commitCount = date ? commitsByDate[date]?.length || 0 : 0;
                return (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`h-10 w-10 ${date ? getColorForCommitCount(commitCount) : "bg-transparent"} border-2 border-gray-300 rounded-lg flex justify-center items-center text-xs font-medium transition-all hover:scale-105 relative`}
                    title={date ? `${date}: ${commitCount} commits` : "No commits"}
                  >
                    {date && <span>{new Date(date).getDate()}</span>}
                    {/* 커밋 수를 나타내는 툴팁 */}
                    {date && (
                      <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center opacity-0 hover:opacity-100 bg-black text-white text-xs rounded-md">
                        {commitCount} commits
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommitGraph;
