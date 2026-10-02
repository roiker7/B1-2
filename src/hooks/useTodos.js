import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

// 사용자가 추가 버튼을 눌렀을 때 데이터를 불러오는 상태를 보여주기 위한 코드
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function useTodos() {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTodos()
  }, [])

  async function fetchTodos() {
    setLoading(true)
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      setError(error.message)
    } else {
      setTodos(data)
    }
    setLoading(false)
  }

  async function addTodo(title) {
    //await sleep(3000)

    const { data, error } = await supabase
      .from('todos')
      .insert([{ title }])
      .select()

    if (error) {
      setError(error.message)
      throw new Error(error.message)   // 실패를 호출한 쪽에도 알림
    } else {
      setTodos([...todos, data[0]])
    }
  }

  async function deleteTodo(id) {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)

    if (error) {
      setError(error.message)
    } else {
      setTodos(todos.filter((todo) => todo.id !== id))
    }
  }

  async function toggleTodo(id, isDone) {
  const { error } = await supabase
    .from('todos')
    .update({ is_done: !isDone })
    .eq('id', id)

  if (error) {
    setError(error.message)
  } else {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, is_done: !isDone } : todo
      )
    )
  }
}


return { todos, loading, error, addTodo, deleteTodo, toggleTodo }
}

export default useTodos