/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "@/config";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// Types
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
}

interface ApiConfig extends AxiosRequestConfig {
  retries?: number;
}

// Constants
const API_URL = config.env.API_URL || "http://localhost:4000/";
const MAX_RETRIES = 3;
const TIMEOUT = 30000;

// Axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: TIMEOUT,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Error handler
const handleApiError = (error: any): ApiResponse => {
  console.log("error: ", error);
  if (error?.response) {
    return {
      success: false,
      error: error.response.data?.message || "Server error",
      status: error.response.status,
    };
  }
  return {
    success: false,
    error: error.message || "Network error",
    status: 500,
  };
};

// API methods
export async function post<T = any>(
  endpoint: string,
  data?: any,
  config?: ApiConfig,
): Promise<ApiResponse<T>> {
  try {
    const response = await axiosInstance.post<T>(endpoint, data, config);
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    return handleApiError(error);
  }
}

export async function get<T = any>(
  endpoint: string,
  config?: ApiConfig,
): Promise<ApiResponse<T>> {
  try {
    const response = await axiosInstance.get<T>(endpoint, config);
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    return handleApiError(error);
  }
}

export async function put<T = any>(
  endpoint: string,
  data?: any,
  config?: ApiConfig,
): Promise<ApiResponse<T>> {
  try {
    const response = await axiosInstance.put<T>(endpoint, data, config);
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    return handleApiError(error);
  }
}

export async function del<T = any>(
  endpoint: string,
  config?: ApiConfig,
): Promise<ApiResponse<T>> {
  try {
    const response = await axiosInstance.delete<T>(endpoint, config);
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    return handleApiError(error);
  }
}

// Token management
export const setAuthToken = (token: string | null): void => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

export default {
  post,
  get,
  put,
  delete: del,
  setAuthToken,
};
