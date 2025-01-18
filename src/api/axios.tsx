import Axios from 'axios';

// GitHub 토큰을 환경 변수에서 가져오기
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

const axios = Axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Authorization: `token ${GITHUB_TOKEN}`,
  },
});

export default axios;
