import { useState } from 'react'

import { loginUser } from '../reducers/userReducer'
import { useDispatch } from 'react-redux'

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

const Loginform = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()

  const handleLogin = async (event) => {
    event.preventDefault()
    setUsername('')
    setPassword('')
    dispatch(loginUser(username, password))
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <Form onSubmit={handleLogin}>
        <Form.Group as={Row} className="mb-3" controlId="Username">
          <Form.Label column sm="1">
            Username
          </Form.Label>
          <Col sm="2">
            <Form.Control
              type="text"
              placeholder="Username"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3" controlId="Password">
          <Form.Label column sm="1">
            Password
          </Form.Label>
          <Col sm="2">
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </Col>
        </Form.Group>
        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
    </div>
  )
}

export default Loginform
