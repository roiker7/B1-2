import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">할 일 관리</Link>
        <nav className="nav">
          <Link to="/">홈</Link>
          <Link to="/todos">할 일 목록</Link>
        </nav>
      </div>
    </header>
  )
}

export default Header