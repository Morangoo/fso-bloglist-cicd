import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import userService from '../../services/users'
import Table from 'react-bootstrap/Table'

const UserList = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    userService.getAll().then((userList) => {
      setUsers(userList)
    })
  }, [])

  return (
    <div>
      <h2>Users</h2>

      <Table striped bordered hover className="w-50">
        <thead>
          <tr>
            <th>Username</th>
            <th>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.username}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default UserList
