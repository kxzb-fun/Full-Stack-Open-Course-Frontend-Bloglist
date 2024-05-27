import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

test('renders content', async () => {
  const blog = {
    title: 'this is a test blog',
    author: 'qqq',
    likes: 99,
    url: 'lll.com'
  }
  const mockHandler = vi.fn()
  const mockLikeHandler = vi.fn()
  render(<Blog blog={blog} showBlogInfo={mockHandler} handleLike={mockLikeHandler}/>)
  //   screen.debug()
  const title = screen.getByText(blog.title)
  const author = screen.getByText(blog.author)
  const likes = screen.queryByText(blog.likes)
  const url = screen.queryByText(blog.url)
  expect(title).toBeDefined()
  expect(author).toBeDefined()
  //   https://testing-library.com/docs/guide-disappearance/#nottobeinthedocument
  expect(likes).not.toBeInTheDocument()
  expect(url).not.toBeInTheDocument()
  // 模拟点击事件
  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
  expect(likes).toBeDefined()
  expect(url).toBeDefined()
  // 测试点击两侧
  const likeBtn = screen.getByText('like')
  await user.click(likeBtn)
  await user.click(likeBtn)
  expect(mockLikeHandler.mock.calls).toHaveLength(2)
})