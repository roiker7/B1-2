import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'

function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="page home-hero">
      <h1>오늘 할 일, 가볍게 정리해보세요</h1>
      <p className="home-subtitle">
        할 일을 추가하고, 체크하고, 지우고 — 그게 전부입니다.
      </p>
      <Button onClick={() => navigate('/todos')}>할 일 보러가기</Button>
    </div>
  )
}

export default HomePage
