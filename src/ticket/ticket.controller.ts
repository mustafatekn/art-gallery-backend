import { createTicket } from './ticket.service'
import { isEmpty } from '../util/validate'
import { Req, Res } from '../types'

export const createNewTicket = async (req: Req, res: Res) => {
    const { name, email, phone, subject, message } = req.body
    const emptyErrors = isEmpty({ name, email, phone, subject, message })

    if (Object.keys(emptyErrors).length > 0)
        return res.status(400).json(emptyErrors)

    try {
        const createdTicket: any = await createTicket({
            name,
            email,
            phone,
            subject,
            message,
        })
        return res.status(201).json(createdTicket)
    } catch (error) {
        return res.status(500).json(error)
    }
}
