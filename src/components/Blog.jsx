const Blog = ({ blog, showBlogInfo, handleLike, handleRemoveBlog }) => {
  const block = {
    display: 'block',
  }
  const showBlock = {
    display: blog.show ? 'block' : 'none',
  }
  const userId =  JSON.parse(window.localStorage.getItem('loggedBlogappUser')).user_id
  // console.log(userId);
  // console.log(blog);
  const showRm = {
    display: blog.user[0] == userId ? 'block' : 'none',
  }
  const showBlog = (event, blog) => {
    event.preventDefault()
    showBlogInfo(blog)
  }
  const solid = {
    border: '2px solid black',
    margin: '6px',
  }
  const onLikeClick = (event, blog) => {
    event.preventDefault()
    handleLike(blog)
  }
  const onRemoveClick = (event, blog) => {
    event.preventDefault()
    handleRemoveBlog(blog)
  }
  return (
    <div style={solid} className="blog-item">
      <div>
        <span>{blog.title}</span>
        <span>{blog.author}</span>
        <span>
          <button onClick={(event) => showBlog(event, blog)}>
            {blog.show ? 'hide' : 'view'}
          </button>
        </span>
      </div>

      <p style={showBlock}>
        <span style={block}>URL: {blog.url}</span>
        <span style={block}>
          Likes: {blog.likes}
          <button onClick={(event) => onLikeClick(event, blog)}>like</button>
        </span>
        <span style={block}>Author: {blog.author}</span>
      </p>
      <div style={showRm}>
        <button onClick={(event) => onRemoveClick(event, blog)}>remove</button>
      </div>
    </div>
  )
}

export default Blog
