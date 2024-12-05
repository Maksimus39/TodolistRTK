import { createSlice, isFulfilled, isPending, isRejected } from "@reduxjs/toolkit"
import { LoginArgs } from "../features/auth/api/authAPI.types"
import { Dispatch } from "redux"
import { _authApi } from "../features/auth/api/_authApi"
import { ResultCode } from "common/enums"
import { tasksApi } from "../features/todolists/api/_tasksApi"
import { todolistsApi } from "../features/todolists/api/todolistsApi"

export type ThemeMode = "dark" | "light"
export type RequestStatus = "idle" | "loading" | "succeeded" | "failed"

export const appSlice = createSlice({
  name: "app",
  initialState: {
    themeMode: "light" as ThemeMode,
    status: "idle" as RequestStatus,
    error: null as string | null,
    isLoggedIn: false,
  },
  reducers: (create) => ({
    changeTheme: create.reducer<{ themeMode: ThemeMode }>((state, action) => {
      state.themeMode = action.payload.themeMode
    }),
    setAppStatus: create.reducer<{ status: RequestStatus }>((state, action) => {
      state.status = action.payload.status
    }),
    setAppError: create.reducer<{ error: string | null }>((state, action) => {
      state.error = action.payload.error
    }),
    setIsLoggedIn: create.reducer<{ isLoggedIn: boolean }>((state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn
    }),
  }),
  extraReducers: (builder) => {
    builder
      .addMatcher(isPending, (state, action) => {
        if (
          todolistsApi.endpoints.getTodolists.matchPending(action) ||
          tasksApi.endpoints.getTasks.matchPending(action)
        ) {
          return;
        }
        state.status = "loading";
      })
      .addMatcher(
        isFulfilled(),
        (state) => {
          state.status = "succeeded"
        },
      )
      .addMatcher(
        isRejected(),
        (state) => {
          state.status = "failed"
        },
      )
  },
  selectors: {
    selectThemeMode: (state) => state.themeMode,
    selectAppStatus: (state) => state.status,
    selectAppError: (state) => state.error,
    selectIsLoggedIn: (state) => state.isLoggedIn,
  },
})

export const loginTC = (data: LoginArgs) => (dispatch: Dispatch) => {
  dispatch(setAppStatus({ status: "loading" }))
  _authApi
    .login(data)
    .then((res) => {
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(setAppStatus({ status: "succeeded" }))
        dispatch(setIsLoggedIn({ isLoggedIn: true }))
        localStorage.setItem("sn-token", res.data.data.token)
      }
    })

}

export const logoutTC = () => (dispatch: Dispatch) => {
  dispatch(setAppStatus({ status: "loading" }))
  _authApi
    .logout()
    .then((res) => {
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(setAppStatus({ status: "succeeded" }))
        dispatch(setIsLoggedIn({ isLoggedIn: false }))
        localStorage.removeItem("sn-token")
      }
    })
}

export const { changeTheme, setAppError, setAppStatus, setIsLoggedIn } = appSlice.actions
export const { selectAppStatus, selectAppError, selectThemeMode, selectIsLoggedIn } = appSlice.selectors
export const appReducer = appSlice.reducer
