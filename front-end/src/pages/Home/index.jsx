// Exporting the main component at the end
// export default Home

/**
 * Home Component
 * ----------------
 * This React component provides a simple CRUD interface (Create, Read, Delete) for users.
 * It allows the user to register new people by entering their name, age, and email,
 * fetches all registered users from the backend API, and displays them dynamically in cards.
 * Each card includes a delete button (trash icon) to remove a specific user from the list.
 */

import './style.css' // Import the stylesheet for this component
import { FaTrash } from 'react-icons/fa' // Import the trash icon component from react-icons library
import api from '../../services/api' // Import the Axios instance for backend API requests
import { useEffect, useState, useRef } from 'react' // React hooks for state management and side effects

function Home() {

  /**
   * useState Hook
   * -------------
   * `users` stores the list of users retrieved from the backend.
   * `setUsers` is the function used to update that list dynamically.
   */
  const [users, setUsers] = useState([])

  /**
   * useRef Hook
   * -----------
   * These references allow direct access to input elements (uncontrolled inputs).
   * Instead of using useState for each field, useRef gets the current value directly from the DOM.
   */
  const inputName = useRef()
  const inputAge = useRef()
  const inputEmail = useRef()

  /**
   * getUsers()
   * ----------
   * Asynchronous function that requests all users from the backend (`GET /users`).
   * The result is stored in the `users` state to render the list on screen.
   */
  async function getUsers() {
    const usersFromApi = await api.get('/users') // Make GET request to the API
    setUsers(usersFromApi.data) // Update local state with the returned user data
  }

  /**
   * createUsers()
   * -------------
   * Handles the creation of a new user by sending a POST request to the API (`/users`).
   * It collects values from input references, converts age to a number (required by Prisma),
   * clears the input fields, and refreshes the user list.
   */
  async function createUsers() {
    await api.post('/users', {
      name: inputName.current.value,
      age: Number(inputAge.current.value), // Convert string to number
      email: inputEmail.current.value
    })

    // Clear input fields after submitting
    inputName.current.value = ''
    inputAge.current.value = ''
    inputEmail.current.value = ''

    // Update displayed list with the newly added user
    getUsers()
  }

  /**
   * deleteUsers(id)
   * ----------------
   * Removes a specific user by their ID using the DELETE HTTP method (`/users/:id`).
   * After deletion, it calls getUsers() again to refresh the UI.
   */
  async function deleteUsers(id) {
    await api.delete(`/users/${id}`)
    getUsers()
  }

  /**
   * useEffect Hook
   * ---------------
   * This effect runs once when the component is mounted.
   * It calls `getUsers()` to fetch and display the initial user list.
   */
  useEffect(() => {
    getUsers()
  }, [])

  /**
   * JSX Return
   * ----------
   * Contains the component’s visual structure:
   * - A form to add new users.
   * - A dynamic list of user cards rendered via `.map()`.
   */
  return (
    <div className='container'>
      
      {/* User registration form */}
      <form>
        <h1>User Registration</h1>
        
        {/* Uncontrolled inputs linked via refs */}
        <input placeholder='Name' name='name' type='text' ref={inputName} />
        <input placeholder='Age' name='age' type='number' ref={inputAge} />
        <input placeholder='Email' name='email' type='email' ref={inputEmail} />
        
        {/* Button triggers user creation function — type='button' prevents page reload */}
        <button type="button" onClick={createUsers}>Register</button>
      </form>

      {/* User list — dynamically generated cards */}
      {users.map(user => (
        <div key={user.id} className='card'>
          
          {/* Display user data */}
          <div>
            <p>Name: <span>{user.name}</span></p>
            <p>Age: <span>{user.age}</span></p>
            <p>Email: <span>{user.email}</span></p>
          </div>

          {/* Delete button with trash icon (FaTrash) */}
          <button onClick={() => deleteUsers(user.id)}>
            <FaTrash />
          </button>
        </div>
      ))}
    </div>
  )
}

export default Home