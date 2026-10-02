import { useParams, Link } from 'react-router-dom'
import useTodos from '../hooks/useTodos'

function TodoDetailPage() {
  const { id } = useParams()
  const { todos, loading } = useTodos()

  if (loading) return <p>불러오는 중...</p>

  const todo = todos.find((t) => t.id === Number(id))

  if (!todo) {
    return (
      <div className="page">
        <p>해당 할 일을 찾을 수 없습니다.</p>
        <Link to="/todos">목록으로 돌아가기</Link>
      </div>
    )
  }

  return (
    <div className="page">
      <h1>{todo.title}</h1>
      <p>등록일: {new Date(todo.created_at).toLocaleDateString()}</p>
      <p>상태: {todo.is_done ? '완료' : '미완료'}</p>
      <Link to="/todos">목록으로 돌아가기</Link>
    </div>
  )
}

export default TodoDetailPage