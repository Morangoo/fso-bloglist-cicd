import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import Toggleable from './Togglable'
import Createblog from './Createblog'

import ListGroup from 'react-bootstrap/ListGroup'

const BlogList = () => {
  const blogs = useSelector((state) => state.blogs)
  const navigate = useNavigate()

  if (!blogs) {
    return null
  }

  return (
    <div>
      <Toggleable buttonLabel="new blog">
        <Createblog />
      </Toggleable>

      <ListGroup>
        {blogs.map((blog) => (
          <ListGroup.Item key={blog.id} action onClick={() => navigate(`/blogs/${blog.id}`)}>
            {blog.title} {blog.author}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  )
}

export default BlogList
