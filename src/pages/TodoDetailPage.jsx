import { useParams } from 'react-router-dom'
import useTodos from '../hooks/useTodos'

function TodoDetailPage() {
  const { id } = useParams()
  const { todos } = useTodos()

  const todo = todos.find((t) => t.id === Number(id))

  if (!todo) {
    return <p>해당 할 일을 찾을 수 없습니다.</p>
  }

  return <h1>{todo.title}</h1>
}

export default TodoDetailPage