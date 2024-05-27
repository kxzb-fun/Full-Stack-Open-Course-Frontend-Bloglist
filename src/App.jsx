import { useState, useEffect, useRef } from 'react'
import BlogList from './components/BlogList'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Header from './components/Header'
const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [messageInfo, setMessageInfo] = useState({ type: '', message: null })
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)

      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessageInfo({ type: 'error', message: 'Wrong credentials' })
      setTimeout(() => {
        setMessageInfo({ message: null })
      }, 5000)
    }
  }

  const addBlog = async (e) => {
    e.preventDefault()
    blogFormRef.current.toggleVisibility()
    const res = await blogService.create(newBlog).catch((error) => {
      setMessageInfo({ type: 'error', message: error.message })
      setTimeout(() => {
        setMessageInfo({ message: null })
      }, 5000)
      return false
    })
    setNewBlog({
      title: '',
      author: '',
      url: '',
    })
    if (res) {
      blogService.getAll().then((blogs) => setBlogs(blogs))
    }
  }
  const handleBlogChange = (e) => {
    const { name, value } = e.target
    setNewBlog({ ...newBlog, [name]: value })
  }
  const handleLoggout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const showBlogInfo = (blog) => {
    setBlogs((prevBlogs) =>
      prevBlogs.map((item) =>
        item.id === blog.id ? { ...item, show: !item.show } : item
      )
    )
  }

  const handleLike = async(blog) => {
    const res = await blogService.update(blog.id,{ ...blog,likes: blog.likes+1 }).catch(error => {
      setMessageInfo({ type: 'error', message: error.message })
      setTimeout(() => {
        setMessageInfo({ message: null })
      }, 5000)
      return false
    })
    if(res) {
      setBlogs((prevBlogs) =>
        prevBlogs.map((item) =>
          item.id === blog.id ? { ...item, likes: item.likes+1 } : item
        )
      )
    }

  }

  const handleRemoveBlog = (blog) => {
    const flag = window.confirm('确定要删除吗？')
    if(!flag) {
      return
    }
    blogService.deleteBlog(blog.id).then(() => {
      blogService.getAll().then((blogs) => setBlogs(blogs))
    })
      .catch(error => {
        setMessageInfo({ type: 'error', message: error.message })
        setTimeout(() => {
          setMessageInfo({ message: null })
        }, 5000)
        return false
      })
  }
  return (
    <div>
      <Notification message={messageInfo.message} type={messageInfo.type} />
      {user === null ? (
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      ) : (
        <div>
          <Header user={user} handleLoggout={handleLoggout} />
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm
              addBlog={addBlog}
              newBlog={newBlog}
              handleBlogChange={handleBlogChange}
            />
          </Togglable>
          <BlogList
            blogs={blogs}
            showBlogInfo={showBlogInfo}
            handleLike={handleLike}
            handleRemoveBlog={handleRemoveBlog}
          />
        </div>
      )}
    </div>
  )
}

export default App
