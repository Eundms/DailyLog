import { GITHUB_API } from './apiEndpoints';
import axios from './axios'; 

// 최근 1년 동안의 커밋을 날짜별로 그룹화하는 함수
const getCommitsGroupedByDate = async (GITHUB_USERNAME: string) => {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1); // 최근 1년

  try {
    // 사용자의 모든 리포지토리 목록 가져오기
    const reposResponse = await axios.get(GITHUB_API.REPOS(GITHUB_USERNAME));

    // 각 리포지토리에서 커밋 내역을 조회
    const allCommits = await Promise.all(
      reposResponse.data.map(async (repo: any) => {
        const commitsResponse = await axios.get(GITHUB_API.COMMITS(GITHUB_USERNAME, repo.name), {
          params: {
            since: oneYearAgo.toISOString(),
            until: new Date().toISOString(),
          },
        });
        // 커밋에 레포지토리 이름 추가
        return commitsResponse.data.map((commit: any) => ({
          ...commit,
          repository: repo.name,
        }));
      })
    );

    // 모든 리포지토리에서 최근 1년 동안의 커밋을 날짜별로 그룹화
    const allCommitsFlattened = allCommits.flat();
    const commitsGroupedByDate = allCommitsFlattened.reduce((acc: any, commit: any) => {
      const commitDate = new Date(commit.commit.committer.date).toISOString().split('T')[0];
      if (!acc[commitDate]) {
        acc[commitDate] = [];
      }
      acc[commitDate].push({
        ...commit,
        repository: commit.repository, // 레포지토리 이름 포함
      });
      return acc;
    }, {});

    // 날짜를 기준으로 역순 정렬
    const sortedCommitsGroupedByDate = Object.fromEntries(
      Object.entries(commitsGroupedByDate).sort(([dateA], [dateB]) => {
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      })
    );

    console.log("Grouped commits by date (sorted):", sortedCommitsGroupedByDate);
    return sortedCommitsGroupedByDate;
  } catch (error) {
    console.error("Error fetching commits:", error);
  }
};

export default getCommitsGroupedByDate;
