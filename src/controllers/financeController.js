import { statementSchema } from '../validation/statement.js';
import * as financeService from '../services/financeService.js';

async function createStatement(req, res) {
    const userId = res.locals.user;

    const { value, description } = req.body;
    const {
        type,
    } = req.query;

    const validate = statementSchema.validate({
        value,
        description,
    });

    if (validate.error) {
        return res.status(400).send(validate.error.message);
    }

    try {
        await financeService.verifyType({
            userId,
            value,
            description,
            type,
        });

        return res.sendStatus(200);
    } catch (error) {
        return res.status(500);
    }
}

async function getStatement(req, res) {
    const userId = res.locals.user?.userId;

    try {
        const financeEventsData = await financeService.getStatement({ userId });

        const {
            wallet,
            total,
        } = financeEventsData;

        return res.send({ wallet, total });
    } catch (error) {
        return res.status(500);
    }
}

export {
    createStatement,
    getStatement,
};
