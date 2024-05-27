const Header = ({ user, handleLoggout }) => {
  return (
    <div>
      <h2>Blogs</h2>
      <p>
        {user.name} logged-in <button onClick={handleLoggout}>loggout</button>
      </p>
    </div>
  )
}

export default Header
