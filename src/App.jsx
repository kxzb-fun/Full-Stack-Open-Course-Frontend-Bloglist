import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({ title: "", author: "", url: "" });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [messageInfo, setMessageInfo] = useState({ type: "", message: null });
  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log("logging in with", username, password);
    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);

      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setMessageInfo({ type: "error", message: "Wrong credentials" });
      setTimeout(() => {
        setMessageInfo({message:null});
      }, 5000);
    }
  };
  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        title
        <input value={newBlog.title} name="title" onChange={handleBlogChange} />
      </div>
      <div>
        author
        <input
          value={newBlog.author}
          name="author"
          onChange={handleBlogChange}
        />
      </div>
      <div>
        url
        <input value={newBlog.url} name="url" onChange={handleBlogChange} />
      </div>

      <div>
        <button type="submit">create</button>
      </div>
    </form>
  );

  const addBlog = async (e) => {
    e.preventDefault();
    console.log(newBlog);
    // 提交后清空表单字段
    setNewBlog({
      title: "",
      author: "",
      url: "",
    });
    const res = await blogService.create(newBlog).catch((error) => {
      setMessageInfo({ type: "error", message: error.message });
      setTimeout(() => {
        setMessageInfo({message:null});
      }, 5000);
      return false
    });
    if (res) {
      blogService.getAll().then((blogs) => setBlogs(blogs));
    }
  };
  const handleBlogChange = (e) => {
    const { name, value } = e.target;
    setNewBlog({ ...newBlog, [name]: value });
    console.log(newBlog);
  };
  const handleLoggout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
  };
  return (
    <div>
      <h2>{user === null ? "login in to application" : "blogs"}</h2>
      <Notification message={messageInfo.message} type={messageInfo.type} />
      {user === null ? (
        loginForm()
      ) : (
        <div>
          <p>
            {user.name} logged-in{" "}
            <button onClick={handleLoggout}>loggout</button>
          </p>
          <h2>create new</h2>
          <div>{blogForm()}</div>

          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
