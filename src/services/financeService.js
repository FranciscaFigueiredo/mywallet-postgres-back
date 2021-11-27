import dayjs from 'dayjs';
import * as financeRepository from '../repositories/financeRepository.js';

async function verifyType({
    userId,
    value,
    description,
    type,
}) {
    let valueData = value;

    if (type === 'exit' && value > 0) {
        valueData *= -1;
    }

    if (type === 'entry' && value < 0) {
        valueData *= -1;
    }

    const dateToday = dayjs().locale('pt-Br').format('DD/MM/YYYY HH:mm:ss');

    const createdfinance = financeRepository.create({
        userId,
        value: valueData,
        description,
        date: dateToday,
    });

    return createdfinance;
}

async function getStatement({ userId }) {
    try {
        const wallet = await financeRepository.getEventsByUserId({ userId });

        const total = await financeRepository.getTotalFinancialEvents({ userId });

        return { wallet, total };
    } catch (error) {
        return false;
    }
}

export {
    verifyType,
    getStatement,
};
