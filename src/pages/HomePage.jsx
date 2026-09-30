/*
import { useState } from 'react'
import Input from '../components/Input'

function HomePage() {
  const [text, setText] = useState('')

  return (
    <div>
      <h1>홈</h1>
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="테스트 입력"
      />
      <p>지금 입력된 값: {text}</p>
    </div>
  )
}

export default HomePage
*/
function HomePage() {
  return <h1>홈</h1>
}

export default HomePage