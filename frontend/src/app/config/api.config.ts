import axios from "axios";


export interface IAPIError {
  msg: string;
  ok: boolean;
  status?: number;
  rawError?: any;
}



const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorObj:{
      msg: string,
      ok: boolean,
    } = {
      msg: "Something went wrong. Try again later.",
      ok: false,
    };

    if(error instanceof axios.AxiosError) {
      if (error.response) {
        errorObj.msg = error.response.data?.msg || errorObj.msg;
        errorObj.ok = false;
      }
    }

    return Promise.reject({
      ...errorObj,
      status: error.response?.status,
      rawError: error,
    });
  }
);

export default apiClient;
