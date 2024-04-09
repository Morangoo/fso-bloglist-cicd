import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { create } from '../reducers/blogReducer'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

const Createblog = ({ addBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const handleCreation = async (event) => {
    event.preventDefault()

    dispatch(create({ title, author, url }, user.username))
  }

  return (
    <div>
      <h2>Create new</h2>
      <Form onSubmit={handleCreation}>
        <Form.Group as={Row} className="mb-3" controlId="Title">
          <Form.Label column sm="1">
            Title
          </Form.Label>
          <Col sm="3">
            <Form.Control
              type="text"
              placeholder="Title"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="Author">
          <Form.Label column sm="1">
            Author
          </Form.Label>
          <Col sm="3">
            <Form.Control
              type="text"
              placeholder="Author"
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="Url">
          <Form.Label column sm="1">
            Url
          </Form.Label>
          <Col sm="3">
            <Form.Control
              type="text"
              placeholder="Url"
              value={url}
              onChange={({ target }) => setUrl(target.value)}
            />
          </Col>
        </Form.Group>

        <Button variant="primary" className="mb-2" type="submit">
          Create
        </Button>
      </Form>
    </div>
  )
}

export default Createblog
