import { useState } from 'react'
import Input from './Input'
import Button from './Button'

function TodoForm({ onSubmit }) {
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()

    if (title.trim() === '') {
      setError('할 일 제목을 입력해주세요.')
      return
    }

    setError('')
    onSubmit(title)
    setTitle('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="할 일을 입력하세요"
      />
      <Button type="submit">추가</Button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  )
}

export default TodoForm