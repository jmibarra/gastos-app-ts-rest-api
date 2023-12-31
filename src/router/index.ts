import express, { Router } from 'express';

import authentication from './authentication';
import users from './users';
import expenses from './expenses';
import status from './status';
import category from './category';
import incomes from './incomes'

const router = express.Router();

export default (): express.Router => {
    authentication(router);
    users(router);
    expenses(router);
    status(router);
    category(router);
    incomes(router)

    
    return router;
}