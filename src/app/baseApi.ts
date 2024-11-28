import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { setAppError } from "./appSlice"


export const baseApi = createApi({
  reducerPath: 'todolistsApi',
  baseQuery: async (args, api, extraOptions) => {
    const result = await fetchBaseQuery({
      baseUrl: process.env.REACT_APP_BASE_URL,
      prepareHeaders: headers => {
        headers.set('API-KEY', `${process.env.REACT_APP_API_KEY}`)
        headers.set('Authorization', `Bearer ${localStorage.getItem('sn-token')}`)
      },
    })(args, api, extraOptions)

    if (result.error) {
      if (result.error.status === 'FETCH_ERROR') {
        api.dispatch(setAppError({ error: result.error.error }))
      }
      if (result.error.status === 'PARSING_ERROR') {
        api.dispatch(setAppError({ error: result.error.error }))
      }
    }
    return result
  },
  endpoints: () => ({}),
  tagTypes: ['Todolist', 'Task'],
})