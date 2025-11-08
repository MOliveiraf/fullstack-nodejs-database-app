import express from 'express'
import { prisma } from './utils/prisma.js'

const app = express()
app.use(express.json())

app.post('/users', async (req, res) => { 
    // Create a new user in the database using data from the request body
    await prisma.user.create({
        data: {
            email: req.body.email,
            name: req.body.name,
            age: req.body.age
        }
    })
    
    // Respond with HTTP 201 (Created)
    // Return the created user as JSON
    res.status(201).json(req.body)
})


app.get('/users', async (req, res) => {
    let users = []

    // Check if query parameters are provided
    if (req.query) {
        // Fetch users that match the provided filters (if any)
        users = await prisma.user.findMany({
            where: {
                name: req.query.name,
                email: req.query.email,
                // Convert "age" to a number, since all query params come as strings
                age: req.query.age ? Number(req.query.age) : undefined
            }
        })
    } else {
        // Fetch all users if no query filters are provided
        users = await prisma.user.findMany()
    }

    // Respond with HTTP 200 (OK)
    // Return the full list of users as JSON
    res.status(200).json(users)
})


app.put('/users/:id', async (req, res) => {
    // Update an existing user identified by the route parameter "id"
    await prisma.user.update({
        where: {
            id: req.params.id, // ID comes from the URL path parameter
        },
        data: {
            email: req.body.email,
            name: req.body.name,
            age: req.body.age
        }
    })

    // Respond with HTTP 200 (OK)
    // Return the updated user data as JSON
    res.status(200).json(req.body)
})


app.delete('/users/:id', async (req, res) => {
    // Delete an existing user identified by the route parameter "id"
    await prisma.user.delete({
        where: {
            id: req.params.id,
        }
    })

    // Respond with HTTP 200 (OK)
    // Return a success message confirming deletion
    res.status(200).json({ message: 'User has been successfully deleted!' })
})

app.listen(3002, () => {
    console.log('Server is running')
})