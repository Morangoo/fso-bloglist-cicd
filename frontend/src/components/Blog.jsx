import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { deleteBlog, addLikeBlog } from '../reducers/blogReducer'

// THIS COMPONENT IS NOT BEING USED
const Blog = ({ blog, username }) => {
  const [view, setView] = useState(false)
  const dispatch = useDispatch()

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const handleLike = () => {
    dispatch(addLikeBlog(blog))
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      dispatch(deleteBlog(blog.id))
    }
  }

  return (
    <div style={blogStyle} className="blogBody">
      <div className="showWithoutView">
        {blog.title} {blog.author}{' '}
        <button onClick={() => setView(!view)}>{view ? 'hide' : 'view'}</button>
      </div>
      {view && (
        <div className="showWithView">
          {blog.url} <br />
          {blog.likes} <button onClick={handleLike}>like</button> <br />
          {blog.user.username} <br />
          {blog.user.username === username && <button onClick={handleDelete}>delete</button>}
        </div>
      )}
    </div>
  )
}

export default Blog
