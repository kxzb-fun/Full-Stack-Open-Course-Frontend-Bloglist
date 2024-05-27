import Blog from './Blog'
const BlogList = ({ blogs, showBlogInfo, handleLike, handleRemoveBlog }) => {
  return blogs.map((blog) => <Blog key={blog.id} blog={blog} showBlogInfo={showBlogInfo} handleLike={handleLike} handleRemoveBlog={handleRemoveBlog}/>)
}

export default BlogList
