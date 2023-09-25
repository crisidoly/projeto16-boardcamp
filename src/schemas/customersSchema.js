import joiBase from "joi"


export const customerSchema = joiBase.object({
    name: joiBase.string().required().min(1),
    phone: joiBase.string().regex(/^\d+$/).required().max(11).min(10),
    cpf: joiBase.string().length(11).required().regex(/^\d+$/),
    birthday: joiBase.date().max('now').iso()
})