import { Link } from 'react-router-dom'
import useTodos from '../hooks/useTodos'
import TodoForm from '../components/TodoForm'

function TodoNewPage() {
  const { addTodo } = useTodos()

  async function handleAdd(title) {
    await addTodo(title)
  }

  return (
    <div className="page">
      <Link to="/todos" className="back-link">← 목록으로</Link>
      <h1>새 할 일 추가</h1>
      <div className="form-card">
        <TodoForm onSubmit={handleAdd} />
      </div>
    </div>
  )
}

export default TodoNewPage