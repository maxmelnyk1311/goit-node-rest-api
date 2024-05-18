import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string().required().min(3).max(30),
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    phone: Joi.string().required().min(7).max(12)
})

export const updateContactSchema = Joi.object({
    name: Joi.string().optional().min(3).max(30),
    email: Joi.string().optional().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    phone: Joi.string().optional().min(7).max(12),
})

export const updateFavoriteInContact = Joi.object({
    favorite: Joi.boolean().required(),
})