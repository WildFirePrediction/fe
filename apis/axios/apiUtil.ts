import axiosInstance from './axiosInstance';
import { ApiResponse } from '../types/response';

export const apiGet = async <T>(url: string, params?: any): Promise<ApiResponse<T>> => {
  const response = await axiosInstance.get<ApiResponse<T>>(url, { params });
  return response.data;
};

export const apiPost = async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
  const response = await axiosInstance.post<ApiResponse<T>>(url, data);
  return response.data;
};

// export const authApiGet = async <T>(url: string, params?: any): Promise<ApiResponse<T>> => {
//   const response = await tokenInstance.get<ApiResponse<T>>(url, { params });
//   return response.data;
// };

// export const authApiPost = async <T>(
//   url: string,
//   data?: any,
//   params?: any,
// ): Promise<ApiResponse<T>> => {
//   const response = await tokenInstance.post<ApiResponse<T>>(url, data, {
//     params,
//   });
//   return response.data;
// };

// export const authApiDelete = async <T>(url: string, params?: any): Promise<ApiResponse<T>> => {
//   const response = await tokenInstance.delete<ApiResponse<T>>(url, {
//     params,
//   });
//   return response.data;
// };

// export const authApiPatch = async <T>(
//   url: string,
//   data?: any,
//   params?: any,
// ): Promise<ApiResponse<T>> => {
//   const response = await tokenInstance.patch<ApiResponse<T>>(url, data, {
//     params,
//   });
//   return response.data;
// };

// export const authApiPut = async <T>(
//   url: string,
//   data?: any,
//   params?: any,
// ): Promise<ApiResponse<T>> => {
//   const response = await tokenInstance.put<ApiResponse<T>>(url, data, {
//     params,
//   });
//   return response.data;
// };
