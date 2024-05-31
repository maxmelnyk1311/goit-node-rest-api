import Joi from "joi";

export const createUserSchema = Joi.object({
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().required(),
    subscription: Joi.string().optional(),
})

export const logInUserSchema = Joi.object({
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().required(),
})

export const verifyUserSchema = Joi.object({
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
})