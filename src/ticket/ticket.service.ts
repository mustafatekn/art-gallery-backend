import Ticket from './ticket.model'

export const createTicket = async ({
    name,
    email,
    phone,
    subject,
    message,
}: any) => {
    const ticket = new Ticket({
        name,
        email,
        phone,
        subject,
        message,
    })
    return await ticket.save()
}

export const getTickets = async () => {
    return await Ticket.find()
}
