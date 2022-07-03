import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import jwt_decode from 'jwt-decode'
import { isEmpty, isMatched, isEmail, isAdmin } from '../util/validate'
import { UserData, Req, Res, Env } from '../types'
import {
    createUser,
    getUserByEmail,
    getUserById,
    getUserByUsername,
    removeUserById,
    updateUserById,
} from './user.service'

export const signUp = async (req: Req, res: Res) => {
    const { username, email, password, confirmPassword } = req.body
    const emptyErrors = isEmpty({
        username,
        email,
        password,
        confirmPassword,
    })
    const matchedErrors = isMatched({ password, confirmPassword })
    const emailErrors = isEmail(email)

    if (Object.keys(emptyErrors).length > 0)
        return res.status(400).json(emptyErrors)
    if (Object.keys(emailErrors).length > 0)
        return res.status(400).json(emailErrors)
    if (Object.keys(matchedErrors).length > 0)
        return res.status(400).json(matchedErrors)

    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        const userSignedUp = await createUser({
            username,
            email,
            password: hashedPassword,
            role: 'member',
        })
        return res.status(201).json(userSignedUp)
    } catch (error) {
        return res.status(500).json(error)
    }
}

export const signIn = async (req: Req, res: Res) => {
    const { username, password } = req.body
    const emptyErrors = isEmpty({ username, password })

    if (Object.keys(emptyErrors).length > 0)
        return res.status(400).json(emptyErrors)

    const user = await getUserByUsername(username)
    const correctPassword =
        user && (await bcrypt.compare(password, user.password))

    if (!user || !correctPassword)
        return res.status(404).json({ error: 'Incorrect username or password' })

    const userId = user.get('id')
    const role = user.get('role')
    const jwtSecret: Env = process.env.JWT_SECRET as string
    const token = jwt.sign({ userId, username, role }, jwtSecret, {
        expiresIn: '7d',
    })

    return res.status(200).json({ ...user.toJSON(), token })
}

export const createNewUser = async (req: Req, res: Res) => {
    const { username, email, password, role } = req.body
    const token = req.get('Authorization')
    if (!token) return res.status(401).json({ error: 'Unauthorized' })
    const userInfo: UserData = jwt_decode(token)
    const authorizationErrors = isAdmin(userInfo.role)
    const emptyErrors = isEmpty({ username, email, password, role })
    const emailErrors = isEmail(email)
    const userFromRequest = await getUserById(userInfo.userId)

    if (Object.keys(emptyErrors).length > 0)
        return res.status(400).json(emptyErrors)
    if (Object.keys(emailErrors).length > 0)
        return res.status(400).json(emailErrors)
    if (!userFromRequest) return res.status(401).json({ error: 'Unauthorized' })
    if (Object.keys(authorizationErrors).length > 0)
        return res.status(401).json(authorizationErrors)

    const userFromUsername = await getUserByUsername(username)
    const userFromEmail = await getUserByEmail(email)
    
    if (userFromUsername || userFromEmail)
        return res.status(404).json({ error: 'This user already exists' })

    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        const createdUser = await createUser({
            username,
            email,
            password: hashedPassword,
            role,
        })
        return res.status(201).json(createdUser)
    } catch (error) {
        return res.status(500).json(error)
    }
}

export const deleteUser = async (req: Req, res: Res) => {
    const { id } = req.params
    const token = req.get('Authorization')
    if (!token) return res.status(401).json({ error: 'Unauthorized' })

    const userInfo: UserData = jwt_decode(token)
    const userFromRequest = await getUserById(userInfo.userId)
    const authorizationErrors = isAdmin(userInfo.role)

    if (Object.keys(authorizationErrors).length > 0)
        return res.status(401).json(authorizationErrors)
    if (!userFromRequest) return res.status(401).json({ error: 'Unauthorized' })

    try {
        const deletedUser = await removeUserById(id)
        return res.status(200).json(deletedUser)
    } catch (error) {
        return res.status(500).json(error)
    }
}

export const updateUser = async (req: Req, res: Res) => {
    const { username, email, password, confirmPassword, role } = req.body
    const { id } = req.params
    const token = req.get('Authorization')
    if (!token) return res.status(401).json({ error: 'Unauthorized' })
    const userInfo: UserData = jwt_decode(token)
    const userFromRequest = await getUserById(userInfo.userId)

    const emptyErrors = isEmpty({
        username,
        email,
        password,
        confirmPassword,
        role,
    })

    const matchedErrors = isMatched({ password, confirmPassword })

    if (Object.keys(emptyErrors).length > 0)
        return res.status(400).json(emptyErrors)
    if (Object.keys(matchedErrors).length > 0)
        return res.status(400).json(matchedErrors)
    if (!userFromRequest) return res.status(401).json({ error: 'Unauthorized' })

    const authorizationErrors = isAdmin(userInfo.role)

    if (Object.keys(authorizationErrors).length > 0)
        return res.status(401).json(authorizationErrors)

    const userForUpdate = await getUserById(id)
    const hierarchyErrors = isAdmin(userForUpdate)

    if (Object.keys(hierarchyErrors).length > 0)
        return res.status(401).json(hierarchyErrors)

    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        const updatedUser = await updateUserById(id, {
            username,
            email,
            password: hashedPassword,
            role,
        })

        return res.status(200).json(updatedUser)
    } catch (error) {
        return res.status(500).json(error)
    }
}
