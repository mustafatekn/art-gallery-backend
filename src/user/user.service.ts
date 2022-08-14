import User from './user.model'

export const createUser = async ({
    username,
    email,
    password,
    role,
}: {
    username: string
    email: string
    password: string
    role: string
}) => {
    const newUser = new User({
        username,
        email,
        password,
        role,
    })

    return await newUser.save()
}

export const getUserById = async (id: string) => {
    return await User.findById(id)
}

export const removeUserById = async (id: string) => {
    return await User.findByIdAndDelete(id)
}

export const updateUserById = async (
    id: string,
    user: {
        username: string
        email: string
        password: string
        role: string
    }
) => {
    return await User.findByIdAndUpdate(id, user)
}

export const getUserByUsername = async (username: string) => {
    return await User.findOne({ username })
}

export const getUserByEmail = async (email: string) => {
    return await User.findOne({ email })
}
