function Input({ value, onChange, placeholder = '', type = 'text' }) {
  return (
    <input
      className="input"
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  )
}

export default Input