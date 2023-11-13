import express from 'express';
import { get } from 'lodash';
import { createExpense, deleteExpenseById, getExpenseByOwner, getExpensesCountByCreator } from '../db/expense';

export const createNewExpense = async (req: express.Request, res: express.Response) => {
    try{
        const { title, dueDate, status, period, category, amount, type } = req.body;

        const owner = get(req, 'identity._id') as unknown as string;

        if (!title)
            return res.sendStatus(400);
      
        const expense = await createExpense({
            title,
            dueDate,
            status,
            period,
            category,
            amount,
            type,
            owner
        });

        return res.status(200).json(expense).end()

    }catch(error){
        console.log(error);
        return res.sendStatus(400)
    }
}

export const getAllExpenses = async (req: express.Request, res: express.Response) => {
    try {

        const owner = get(req, 'identity._id') as unknown as string;

        const limit = parseInt(req.query.limit as string) ?? 10;
        const page = parseInt(req.query.page as string) ?? 1;

        const totalCount = await getExpensesCountByCreator(owner); // Obtener el recuento total de documentos
        const expenses = await getExpenseByOwner(owner, limit, page);

        const responseData = {
            expenses: expenses,
            count: totalCount
        }
        
        return res.status(200).json(responseData);

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

//Metodo para borrar un gasto
// Método para actualizar un gasto
