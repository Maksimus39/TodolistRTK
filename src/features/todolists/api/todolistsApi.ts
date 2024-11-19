import { instance } from "common/instance"
import { BaseResponse } from "common/types"
import { Todolist } from "./todolistsApi.types"
import { DomainTodolist } from "../model/todolistsSlice"
import { baseApi } from "../../../app/baseApi"

export const todolistsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTodolists: build.query<DomainTodolist[], void>({
      query: () => "todo-lists",
      transformResponse(todolists: Todolist[]): DomainTodolist[] {
        return todolists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }))
      },
      providesTags: ["Todolist"],
    }),
    addTodolist: build.mutation<BaseResponse<{ item: Todolist }>, string>({
      query: (title) => {
        return {
          url: "todo-lists",
          method: "POST",
          body: { title },
        }
      },
      invalidatesTags: ["Todolist"],
    }),
    updateTodolistTitle: build.mutation<BaseResponse, { id: string; title: string }>({
      query: ({ id, title }) => {
        return {
          url: `todo-lists/${id}`,
          method: "PUT",
          body: { title },
        }
      },
      invalidatesTags: ["Todolist"],
    }),
    removeTodolist: build.mutation<BaseResponse, string>({
      query: (id) => {
        return {
          url: `todo-lists/${id}`,
          method: "DELETE",
        }
      },
      invalidatesTags: ["Todolist"],
    }),
  }),
})

export const { useGetTodolistsQuery, useAddTodolistMutation,useUpdateTodolistTitleMutation,useRemoveTodolistMutation } = todolistsApi















export const _todolistsApi = {
  // ok
  getTodolists() {
    return instance.get<Todolist[]>("todo-lists")
  },
  //
  updateTodolist(payload: { id: string; title: string }) {
    const { title, id } = payload
    return instance.put<BaseResponse>(`todo-lists/${id}`, { title })
  },
  // ok
  createTodolist(title: string) {
    return instance.post<BaseResponse<{ item: Todolist }>>("todo-lists", { title })
  },
  deleteTodolist(id: string) {
    return instance.delete<BaseResponse>(`todo-lists/${id}`)
  },
}
