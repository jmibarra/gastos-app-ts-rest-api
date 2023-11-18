import express, { Router } from "express";
import { isAuthenticated,isExpenseOwner } from "../middlewares";
import { createNewExpense, getAllPeriodExpenses, deleteExpense, updateExpense, getExpense } from "../controllers/expenses"

export default (router: express.Router) => {
    router.post('/expenses', isAuthenticated, createNewExpense);
    router.get('/expenses/all/:period', isAuthenticated, getAllPeriodExpenses);
    router.get('/expenses/:id', isAuthenticated,isExpenseOwner, getExpense);
    router.delete('/expenses/:id', isAuthenticated, isExpenseOwner, deleteExpense);
    router.patch('/expenses/:id', isAuthenticated, isExpenseOwner, updateExpense);
}