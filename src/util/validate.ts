type Errors = {
    [key: string]: string
}

export const isEmpty = (data: object) => {
    let errors: Errors = {}

    Object.entries(data).map((entry) => {
        if (entry[1].trim() === '') {
            errors = {
                ...errors,
                [entry[0]]: `${entry[0]} field is required`,
            }
        }
    })

    return errors
}

export const isMatched = (data: object) => {
    let errors: Errors = {}
    const entries = Object.entries(data)

    if (entries[0][1] !== entries[1][1]) {
        errors = {
            ...errors,
            [entries[0][0]]: `${entries[0][0]}s must match`,
        }
    }

    return errors
}

export const isEmail = (email: string) => {
    let errors: Errors = {}

    const emailRegExp =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    if (!emailRegExp.test(String(email))) errors.email = 'Email cannot be empty'

    return errors
}

export const isAdmin = (role: string) => {
    let errors: Errors = {}
    if (role !== 'admin') errors.authorization = 'Unauthorized request'
    return errors
}
