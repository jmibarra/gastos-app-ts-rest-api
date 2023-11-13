import express, { Router } from "express";
import { isAuthenticated, isOwner } from "../middlewares";
import { createNewExpense, getAllExpenses } from "../controllers/expenses"

export default (router: express.Router) => {
    router.post('/expenses', isAuthenticated, createNewExpense);
    router.get('/expenses', isAuthenticated, getAllExpenses);
    //router.delete('/notes/:id', isAuthenticated, isOwner, dele);
    //router.patch('/notes/:id', isAuthenticated, isOwner, updateNote);
}