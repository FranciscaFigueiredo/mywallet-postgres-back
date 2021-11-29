import { statementSchema } from '../validation/statement.js';
import * as financeService from '../services/financeService.js';

async function createStatement(req, res) {
    const userId = res.locals.user?.idUser;

    const { value, description } = req.body;

    const valueManipulated = Number(value).toFixed(2) * 100;

    const {
        type,
    } = req.query;

    const validate = statementSchema.validate({
        value: valueManipulated,
        description,
    });

    if (validate.error) {
        return res.status(400).send(validate.error.message);
    }

    try {
        await financeService.verifyType({
            userId,
            value: valueManipulated,
            description,
            type,
        });

        return res.sendStatus(200);
    } catch (error) {
        return res.status(500);
    }
}

async function getStatement(req, res) {
    const userId = res.locals.user?.idUser;

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
