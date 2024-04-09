import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { deleteBlog, addLikeBlog, addCommentBlog } from '../reducers/blogReducer'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

const BlogPage = () => {
  const { id } = useParams()
  const blog = useSelector((state) => state.blogs.find((blog) => blog.id === id))
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLike = () => {
    dispatch(addLikeBlog(blog))
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      dispatch(deleteBlog(blog.id))
      navigate('/')
    }
  }

  const handleNewComment = (event) => {
    event.preventDefault()
    const comment = event.target.comment.value

    dispatch(addCommentBlog(blog.id, comment))
  }

  if (!blog) {
    return null
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      <a href={blog.url}>{blog.url}</a> <br />
      {blog.likes}{' '}
      <Button variant="primary" onClick={handleLike} size="sm">
        like
      </Button>{' '}
      <br />
      added by {blog.user.username} <br />
      {user && blog.user.username === user.username && (
        <Button variant="danger" onClick={handleDelete} size="sm" className="mt-2">
          delete
        </Button>
      )}
      <h3 className="mt-3">comments</h3>
      <Form onSubmit={handleNewComment}>
        <Form.Group as={Row} className="mb-3" controlId="Comment">
          <Col sm="3">
            <Form.Control sm="1" type="text" placeholder="Comment here" name="comment" />
          </Col>
          <Col sm="2">
            <Button variant="primary" type="submit">
              Add comment
            </Button>
          </Col>
        </Form.Group>
      </Form>
      <ul>
        {blog.comments.map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>
    </div>
  )
}

export default BlogPage
