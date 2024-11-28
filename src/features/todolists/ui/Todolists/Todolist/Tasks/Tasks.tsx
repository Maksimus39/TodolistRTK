import List from "@mui/material/List"
import { TaskStatus } from "common/enums"
import { DomainTodolist } from "../../../../model/todolistsSlice"
import { Task } from "./Task/Task"
import { useGetTasksQuery } from "../../../../api/_tasksApi"
import { TasksSkeleton } from "../../../skeletons/TasksSkeleton/TasksSkeleton"
import { useAppDispatch } from "common/hooks"
import { useEffect } from "react"
import { setAppError } from "../../../../../../app/appSlice"

type Props = {
  todolist: DomainTodolist
}

type ErrorData = {
  status: number
  data: {
    message: string
  }
}




export const Tasks = ({ todolist }: Props) => {
  const { data, isLoading, isError, error } = useGetTasksQuery(todolist.id)
  console.log({ isError, error })

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (error) {
      let errMsg = 'Some error occurred'
      if ('data' in error) {
        const errData = error.data as ErrorData
        if ('message' in errData) {
          errMsg = errData.message as string
        }
      }
      dispatch(setAppError({ error: errMsg }))
    }
  }, [error])


  let tasksForTodolist = data?.items

  if (todolist.filter === "active") {
    tasksForTodolist = tasksForTodolist?.filter((task) => task.status === TaskStatus.New)
  }

  if (todolist.filter === "completed") {
    tasksForTodolist = tasksForTodolist?.filter((task) => task.status === TaskStatus.Completed)
  }

  if (isLoading) {
    return <TasksSkeleton />
  }

  return (
    <>
      {tasksForTodolist?.length === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <List>
          {tasksForTodolist?.map((task) => {
            return <Task key={task.id} task={task} todolist={todolist} />
          })}
        </List>
      )}
    </>
  )
}
