import Card from './Card'

function TodoList({ todos }) {
  return (
    <div>
      {todos.map((todo) => (
        <Card key={todo.id}>
          <p>{todo.title}</p>
        </Card>
      ))}
    </div>
  )
}

export default TodoList