import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'
import { describe } from 'vitest'
describe('test...', () => {

  test('<BlogForm /> updates parent state and calls onSubmit', async () => {
    const newBlog = {
      title: '测试博客标题',
      author: '测试作者',
      url: 'https://example.com',
      likes: 0,
    }
    const user = userEvent.setup()
    const createBlog = vi.fn()

    render(<BlogForm addBlog={createBlog} newBlog={newBlog} />)
    const submitBtn = screen.getByText('create')

    await user.click(submitBtn)
    expect(createBlog.mock.calls).toHaveLength(1)
    // TODO
    // expect(createBlog.mock.calls[0][0].title).toBe(newBlog.title)
  })
})
