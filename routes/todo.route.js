import express, { Router } from 'express'
import {
    getTodoId,
    createTodo,
    editTodo,
    deleteTodo,
    getAllTodos
} from "../controllers/todo.controller.js"
import { isAdmin, protect } from '../middleware/auth.middleware.js'

const router = express.Router();

// router.get('/admin/todo',protect,isAdmin, getAllTodoAdmin)
router.get('/todo',protect,getAllTodos,)
router.get('/todo/:id',protect,getTodoId)
router.post('/todo/new',protect, createTodo)
router.put('/update/:id',protect,editTodo)
router.delete('/delete/:id',protect,deleteTodo)
// router.delete('/admin/delete/:id',protect,isAdmin,deleteTodoAdmin)

export default router;