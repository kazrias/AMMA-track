import './Button.css'

export const Button = ({ onClick, children, type, disabled }) => {
  return (
    <button disabled={disabled} onClick={onClick} className={`button ${type}`}>{children}</button>
  )
}