import { Request, Response } from 'express'

export type UserData = {
    userId: string
    username: string
    role: string
    email: string
}

export type PostData = {
    id?: string
    title: string
    url: string
    imageUrl: string
    user: {
        id: string
        username: string
        role: string
    }
}

export type UserRegister = {
    username: string
    email: string
    password: string
    confirmPassword: string
    role: string
}

export type DataForValidation = {
    username?: string
    email?: string
    password?: string
    confirmPassword?: string
    role?: string
    title?: string
    url?: string
    imageUrl?: string
}

export type Error = {
    [key: string]: string
}

export type Env = string | undefined
export type Req = Request
export type Res = Response
