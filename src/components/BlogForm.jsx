import PropTypes from "prop-types";

const BlogForm = ({ addBlog, newBlog, handleBlogChange }) => {
  console.log(newBlog);
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title
          <input
            value={newBlog.title}
            name="title"
            onChange={handleBlogChange}
          />
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
    </div>
  );
};
BlogForm.propTypes = {
  addBlog: PropTypes.func.isRequired,
  handleBlogChange: PropTypes.func.isRequired,
  newBlog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default BlogForm;
