import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'

import Loginform from './components/Loginform'
import Notification from './components/Notification'

import UserList from './components/userView/UserList'
import UserView from './components/userView/UserView'
import BlogList from './components/BlogList'
import BlogPage from './components/BlogPage'

import { initializeBlogs } from './reducers/blogReducer'
import { initializeUser, logoutUser } from './reducers/userReducer'
import { useDispatch, useSelector } from 'react-redux'

import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'

const App = () => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUser())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  return (
    <div className="container">
      <Notification />
      {!user && <Loginform />}
      {user && (
        <Navbar bg="light" data-bs-theme="light" className="mb-3">
          <Container>
            <Nav className="me-auto">
              <LinkContainer to="/">
                <Nav.Link>Blogs</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/users">
                <Nav.Link>Users</Nav.Link>
              </LinkContainer>
            </Nav>
            <Nav>
              <p className="my-auto">{user.username} logged in</p>
              <Button variant="secondary" onClick={handleLogout}>
                logout
              </Button>
            </Nav>
          </Container>
        </Navbar>
      )}
      <h2>blog app</h2>

      <Routes>
        <Route path="/users" element={<UserList />} />
        <Route path="/users/:id" element={<UserView />} />
        <Route path="/blogs/:id" element={<BlogPage />} />
        <Route path="/" element={<BlogList />} />
      </Routes>
    </div>
  )
}

export default App
