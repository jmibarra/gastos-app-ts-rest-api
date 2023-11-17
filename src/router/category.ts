import express from "express";
import { isAuthenticated, isCategoryOwner } from "../middlewares";
import { createNewCategory, deleteCategory, getAllCategoriesByOwner, getCategory, updateCategory } from "../controllers/category";


export default (router: express.Router) => {
    router.post('/category', isAuthenticated, createNewCategory);
    router.get('/category', isAuthenticated, getAllCategoriesByOwner);
    router.get('/category/:id', isAuthenticated, isCategoryOwner, getCategory);
    router.delete('/category/:id', isAuthenticated, isCategoryOwner, deleteCategory);
    router.patch('/category/:id', isAuthenticated, isCategoryOwner, updateCategory);
}