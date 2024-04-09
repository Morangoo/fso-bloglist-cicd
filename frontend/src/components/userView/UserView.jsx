import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import userService from '../../services/users'

const UserView = () => {
  const { id } = useParams()
  const [user, setUser] = useState(null)

  useEffect(() => {
    userService.getById(id).then((userData) => {
      setUser(userData)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!user) {
    return null
  }

  return (
    <div>
      <h2>{user.username}</h2>

      <h3>added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default UserView
