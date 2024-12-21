import { instance } from "common/instance"
import { BaseResponse } from "common/types"
import { LoginArgs } from "./authAPI.types"
import { baseApi } from "../../../app/baseApi"

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => {
    return {
      me: build.query<BaseResponse<{ id: number; email: string; login: string }>, void>({
        query: () => "auth/me",
      }),
      login: build.mutation<BaseResponse<{ userId: number; token: string }>, LoginArgs>({
        query: (body) => {
          return {
            url: "auth/login",
            method: "POST",
            body: body,
          }
        },
      }),
      logout: build.mutation<BaseResponse, void>({
        query: () => {
          return {
            url: "auth/login",
            method: "DELETE",
          }
        },
      }),
    }
  },
})

export const { useMeQuery, useLoginMutation, useLogoutMutation } = authApi

export const _authApi = {
  login(payload: LoginArgs) {
    return instance.post<BaseResponse<{ userId: number; token: string }>>(`auth/login`, payload)
  },
  logout() {
    return instance.delete<BaseResponse>("auth/login")
  },
  me() {
    return instance.get<BaseResponse<{ id: number; email: string; login: string }>>("auth/me")
  },
}