import Card from './Card'
import Button from './Button'

function TodoList({ todos, onDelete, onToggle }) {
  return (
    <div>
      {todos.map((todo) => (
        <Card key={todo.id}>
          <input
            type="checkbox"
            checked={todo.is_done}
            onChange={() => onToggle(todo.id, todo.is_done)}
          />
          <span style={{ textDecoration: todo.is_done ? 'line-through' : 'none' }}>
            {todo.title}
          </span>
          <Button onClick={() => onDelete(todo.id)}>삭제</Button>
        </Card>
      ))}
    </div>
  )
}

export default TodoList