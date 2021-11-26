import joi from 'joi';

const statementSchema = joi.object({
    value: joi.number().min(1).required(),
    description: joi.string().min(3).max(30).required(),
});

export { statementSchema };
