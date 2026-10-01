import useTodos from '../hooks/useTodos'
import TodoList from '../components/TodoList'
import TodoForm from '../components/TodoForm'
import Loading from '../components/Loading'
import ErrorState from '../components/ErrorState'
import EmptyState from '../components/EmptyState'

function TodoListPage() {
  const { todos, loading, error, addTodo, deleteTodo, toggleTodo } = useTodos()
  
  return (
    <div>
      <h1>할 일 목록</h1>
      <TodoForm onSubmit={addTodo} />

      {loading && <Loading />}
      {error && <ErrorState message={error} />}
      {!loading && !error && todos.length === 0 && <EmptyState />}
      {!loading && !error && todos.length > 0 && (<TodoList todos={todos} onDelete={deleteTodo} onToggle={toggleTodo} />)}
     
    </div>
  )
}

export default TodoListPage
