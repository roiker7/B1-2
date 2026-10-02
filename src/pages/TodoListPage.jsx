import { Link } from 'react-router-dom'
import useTodos from '../hooks/useTodos'
import TodoList from '../components/TodoList'
import Loading from '../components/Loading'
import ErrorState from '../components/ErrorState'
import EmptyState from '../components/EmptyState'

function TodoListPage() {
  const { todos, loading, error, deleteTodo, toggleTodo } = useTodos()

  return (
    <div className="page">
      <div className="list-header">
        <h1>할 일 목록</h1>
        <Link to="/todos/new" className="btn btn-primary">
          할 일 추가
        </Link>
      </div>

      {loading && <Loading />}
      {error && <ErrorState message={error} />}
      {!loading && !error && todos.length === 0 && <EmptyState />}
      {!loading && !error && todos.length > 0 && (
        <TodoList todos={todos} onDelete={deleteTodo} onToggle={toggleTodo} />
      )}
    </div>
  )
}

export default TodoListPage
