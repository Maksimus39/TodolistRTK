
import { BaseResponse } from "common/types"
import { DomainTask, GetTasksResponse, UpdateTaskModel } from "./tasksApi.types"
import { baseApi } from "../../../app/baseApi"

export const PAGE_SIZE = 4

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTasks: build.query<GetTasksResponse, { todolistId: string; args: { page: number } }>({
      query: ({ todolistId, args }) => {


        const params = {...args,count:PAGE_SIZE}
        return {
          url: `todo-lists/${todolistId}/tasks`,
          params: params,
        }
      },
      providesTags: (res, err, { todolistId }) =>
        res
          ? [...res.items.map(({ id }) => ({ type: "Task", id }) as const), { type: "Task", id: todolistId }]
          : ["Task"],
    }),
    addTask: build.mutation<BaseResponse<{ item: DomainTask }>, { title: string; todolistId: string }>({
      query: ({ todolistId, title }) => {
        return {
          url: `todo-lists/${todolistId}/tasks`,
          method: "POST",
          body: { title },
        }
      },
      invalidatesTags: (res, err, { todolistId }) => [{ type: "Task", id: todolistId }],
    }),
    removeTask: build.mutation<BaseResponse, { todolistId: string; taskId: string }>({
      query: ({ todolistId, taskId }) => {
        return {
          url: `todo-lists/${todolistId}/tasks/${taskId}`,
          method: "DELETE",
          body: { taskId },
        }
      },
      invalidatesTags: (result, error, { taskId }) => [{ type: "Task", id: taskId }],
    }),
    updateTask: build.mutation<
      BaseResponse<{ item: DomainTask }>,
      {
        todolistId: string
        taskId: string
        model: UpdateTaskModel
      }
    >({
      query: ({ todolistId, taskId, model }) => {
        return {
          url: `todo-lists/${todolistId}/tasks/${taskId}`,
          method: "PUT",
          body: model,
        }
      },
      invalidatesTags: (result, error, { taskId }) => [{ type: "Task", id: taskId }],
    }),
  }),
})

export const { useGetTasksQuery, useAddTaskMutation, useRemoveTaskMutation, useUpdateTaskMutation } = tasksApi
