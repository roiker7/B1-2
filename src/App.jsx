import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import TodoListPage from './pages/TodoListPage'
import TodoDetailPage from './pages/TodoDetailPage'
import TodoNewPage from './pages/TodoNewPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="todos" element={<TodoListPage />} />
        <Route path="todos/:id" element={<TodoDetailPage />} />
        <Route path="todos/new" element={<TodoNewPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App