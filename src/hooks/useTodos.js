import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

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
    const { data, error } = await supabase
      .from('todos')
      .insert([{ title }])
      .select()

    if (error) {
      setError(error.message)
    } else {
      setTodos([...todos, data[0]])
    }
  }

  return { todos, loading, error, addTodo }
}

export default useTodos