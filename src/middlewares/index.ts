import express from 'express'
import { get, merge } from 'lodash';

import { getUserBySessionToken  } from '../db/users';
import { getStatusById } from '../db/status';
import { getCategoryById } from '../db/category';
import { getExpenseById } from '../db/expense';
import { getIncomeById } from '../db';

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try{
        
        const sessionToken = req.headers.authorization;//Fix provisorio para usar por axios y no usar mas cookies
        
        if(!sessionToken)
            return res.sendStatus(403);

        const existinUser = await getUserBySessionToken(sessionToken);

        if(!existinUser)
            return res.sendStatus(403);

        merge(req, {identity: existinUser});

        return next();
    }catch(error){
        console.log(error);
        return res.sendStatus(400);        
    }
}

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const { id } = req.params;
      const currentUserId = get(req, 'identity._id') as unknown as string;
  
      if (!currentUserId) {
        return res.sendStatus(400);
      }
  
      if (currentUserId.toString() !== id) {
        return res.sendStatus(403);
      }
  
      next();
    } catch (error) {
      console.log(error);
      return res.sendStatus(400);
    }
}

export const isStatusOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {

        const { id } = req.params;
        const currentUserId = get(req, 'identity._id') as unknown as string;
    
        const status = await getStatusById(id)

        if(!status)
            return res.sendStatus(400);

        if (currentUserId.toString() !== status.owner) {
            return res.sendStatus(403);
        }

        req.body.status = status

        next();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const isCategoryOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {

        const { id } = req.params;
        const currentUserId = get(req, 'identity._id') as unknown as string;
    
        const category = await getCategoryById(id)

        if(!category)
            return res.sendStatus(400);

        if (currentUserId.toString() !== category.owner) {
            return res.sendStatus(403);
        }

        req.body.category = category

        next();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const isExpenseOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {

        const { id } = req.params;
        const currentUserId = get(req, 'identity._id') as unknown as string;
    
        const expense = await getExpenseById(id)

        if(!expense)
            return res.sendStatus(400);

        if (currentUserId.toString() !== expense.owner._id.toString()) {
            return res.sendStatus(403);
        }

        req.body.expense = expense

        next();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const isIncomeOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {

        const { id } = req.params;
        const currentUserId = get(req, 'identity._id') as unknown as string;
    
        const income = await getIncomeById(id)

        if(!income)
            return res.sendStatus(400);

        if (currentUserId.toString() !== income.owner._id.toString()) {
            return res.sendStatus(403);
        }

        req.body.income = income

        next();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}