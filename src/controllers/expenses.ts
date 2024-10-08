import express from 'express';
import { get } from 'lodash';
import { ExpenseModel, createExpense, deleteExpenseById, getExpenseByPeriod, getExpensesByCategory, getExpensesCountByCategory, getExpensesCountByPeriod } from '../db/expense';

export const createNewExpense = async (req: express.Request, res: express.Response) => {
    try{
        const { title, dueDate, status, period, category, amount, type } = req.body;

        const owner = get(req, 'identity._id') as unknown as string;

        if (!title || !period || !status || !amount)
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

export const getAllPeriodExpenses = async (req: express.Request, res: express.Response) => {
    try {

        const owner = get(req, 'identity._id') as unknown as string;

        const { period } = req.params;

        const limit = parseInt(req.query.limit as string) ?? 10;
        const page = parseInt(req.query.page as string) ?? 1;

        const totalCount = await getExpensesCountByPeriod(owner,period); // Obtener el recuento total de documentos
        const expenses = await getExpenseByPeriod(owner,period, limit, page);

        const responseData = {
            expenses: expenses,
            count: totalCount
        }
        
        console.log(responseData)
        return res.status(200).json(responseData);

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getAllExpensesByCategory = async (req: express.Request, res: express.Response) => {
    try {

        const owner = get(req, 'identity._id') as unknown as string;

        const { category } = req.params;

        const limit = parseInt(req.query.limit as string) ?? 10;
        const page = parseInt(req.query.page as string) ?? 1;

        const totalCount = await getExpensesCountByCategory(owner,category); // Obtener el recuento total de documentos
        const expenses = await getExpensesByCategory(owner,category, limit, page);

        const responseData = {
            expenses: expenses,
            count: totalCount
        }
        
        console.log(responseData)
        return res.status(200).json(responseData);

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }

}

export const getExpense = async (req: express.Request, res: express.Response) => {
    try {

        //No necesito volver a traerlo por que ya la obtuve en el middleware "isStatusOwner"
        const expense = req.body.expense
        return res.status(200).json(expense).end();
  
    } catch (error) {
      console.log(error);
      return res.sendStatus(400);
    }
}

export const deleteExpense = async (req: express.Request, res: express.Response) => {
    try {
        
        const { id } = req.params;
        const deletedExpense = await deleteExpenseById(id);
  
        return res.json(deletedExpense);
    
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const updateExpense = async (req: express.Request, res: express.Response) => {
    try {
        const { title, dueDate, status, period, category, amount, type } = req.body;
  
        if (!title)
            return res.sendStatus(400);
  
        const expense = req.body.expense

        if(expense){
            expense.title = title ? title : expense.title;
            expense.dueDate = dueDate ? dueDate : expense.dueDate;
            expense.status = status ? status : expense.status;
            expense.period = period ? period : expense.period;
            expense.category = category ? category : expense.category;
            expense.amount = amount ? amount : expense.amount;
            expense.type = type ? type : expense.type;
            console.log(expense)
            await expense.save().then((expense: any) => {
                return ExpenseModel.populate(expense, { path: 'status category' });
            }).then((populatedExpense: any) => populatedExpense.toObject());
        }else
            return res.sendStatus(404);
      
        return res.status(200).json(expense).end();
  
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}
