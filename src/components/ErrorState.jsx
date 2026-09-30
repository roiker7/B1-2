function ErrorState({ message = '문제가 발생했습니다.' }) {
  return <p>⚠️ {message}</p>
}

export default ErrorState