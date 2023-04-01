import { DataForValidation, Error } from '../types'

export const isEmpty = (data: DataForValidation) => {
    let errors: Error = {}

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

export const isMatched = (data: DataForValidation) => {
    let errors: Error = {}
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
    const errors: Error = {}

    const emailRegExp =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    if (!emailRegExp.test(String(email)))
        errors.email = 'Email must be in email format.'

    return errors
}

export const isAdmin = (role: string) => {
    const errors: Error = {}
    if (role !== 'admin') errors.authorization = 'Unauthorized request'
    return errors
}
