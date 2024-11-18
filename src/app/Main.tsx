import Container from "@mui/material/Container"
import Grid from "@mui/material/Unstable_Grid2"
import { Path } from "common/router"
import { AddItemForm } from "common/components"
import { useAppSelector } from "common/hooks"
import { Navigate } from "react-router-dom"
import { selectIsLoggedIn } from "../features/auth/model/authSlice"
import { Todolists } from "../features/todolists/ui/Todolists/Todolists"
import { useAddTodolistMutation } from "../features/todolists/api/todolistsApi"

export const Main = () => {
  const [addTodolist, res] = useAddTodolistMutation()
  console.log(res)

  // const dispatch = useAppDispatch()

  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  const addTodolistCB = (title: string) => {
    // dispatch(addTodolistTC(title))
    addTodolist(title)
  }

  if (!isLoggedIn) {
    return <Navigate to={Path.Login} />
  }

  return (
    <Container fixed>
      <Grid container sx={{ mb: "30px" }}>
        <AddItemForm addItem={addTodolistCB} />
      </Grid>
      <Grid container spacing={4}>
        <Todolists />
      </Grid>
    </Container>
  )
}
