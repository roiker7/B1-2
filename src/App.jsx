import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import TodoListPage from './pages/TodoListPage'
import TodoDetailPage from './pages/TodoDetailPage'
import TodoNewPage from './pages/TodoNewPage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import './App.css'


function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/todos" element={<TodoListPage />} />
      <Route path="/todos/:id" element={<TodoDetailPage />} />
      <Route path="/todos/new" element={<TodoNewPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App