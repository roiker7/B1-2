import { useState } from 'react'
import Input from './Input'
import Button from './Button'

function TodoForm({ onSubmit }) {
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    if (title.trim() === '') {
      setError('할 일 제목을 입력해주세요.')
      return
    }

    setError('')
    setSuccess(false)
    setSubmitting(true)

    try {
      await onSubmit(title)
      setTitle('')
      setSuccess(true)
    } catch (err) {
      setError('추가에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        value={title}
        onChange={(e) => {
          setTitle(e.target.value)
          setSuccess(false)
        }}
        placeholder="할 일을 입력하세요"
      />
      <Button type="submit" disabled={submitting}>
        {submitting ? '추가 중...' : '추가'}
      </Button>
      {error && <p style={{ color: 'var(--color-danger)' }}>{error}</p>}
      {success && <p style={{ color: 'var(--color-primary)' }}>추가됐습니다 </p>}
    </form>
  )
}

export default TodoForm