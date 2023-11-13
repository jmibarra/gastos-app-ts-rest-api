import express, { Router } from 'express';

import authentication from './authentication';
import users from './users';
import expenses from './expenses';

const router = express.Router();

export default (): express.Router => {
    authentication(router);
    users(router);
    expenses(router);
    
    return router;
}