import mongoose, { Document, Schema, Types } from "mongoose";

interface IExpense extends Document {
    title: string;
    dueDate: Date;
    period: String;
    status : Types.ObjectId;
    category: Types.ObjectId;
    amount: number;
    type: string;
    owner: Types.ObjectId;
}

// Definir el esquema principal con los subdocumentos "Status" y "Periodo"
const expenseSchema = new Schema<IExpense>({
    title: { type: String, required: true},
    dueDate: { type: Date },
    period: { type: String, required: true},
    status : { type: Schema.Types.ObjectId, ref: 'Status', required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    amount: {type: Number, required: true},
    type: { type: String},
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

export const ExpenseModel = mongoose.model('Expense', expenseSchema);

export const getExpenseByPeriod = (ownerId: string, period: string, limit: number, page: number) => {
    const skipCount = (page - 1) * limit; // Calcular la cantidad de documentos que se deben omitir para la paginación

    return ExpenseModel.find({
        'owner': ownerId,
        'period': period,
    }).populate('status')
    .populate('category')
    .populate('owner')
    .skip(skipCount) // Omitir los documentos según el cálculo anterior
    .limit(limit); // Limitar la cantidad de documentos devueltos por página
};

export const getExpensesCountByPeriod = (ownerId: string, period: string) => {
    return ExpenseModel.countDocuments({
        'owner': ownerId,
        'period': period,
    });
};

export const getExpensesByCategory = (ownerId: string, category: string, limit: number, page: number) => {
    const skipCount = (page - 1) * limit; // Calcular la cantidad de documentos que se deben omitir para la paginación

    return ExpenseModel.find({
        'owner': ownerId,
        'category': category
    }).populate('status')
    .populate('category')
    .populate('owner')
    .skip(skipCount) // Omitir los documentos según el cálculo anterior
    .limit(limit); // Limitar la cantidad de documentos devueltos por página
}

export const getExpensesCountByCategory = (ownerId: string, category: string) => {
    return ExpenseModel.countDocuments({
        'owner': ownerId,
        'category': category
    });
};

export const getExpenseById = (id: string) => ExpenseModel.findById(id).populate('status').populate('category').populate('owner');
export const createExpense = (values: Record<string, any>) => {
    return new ExpenseModel(values)
        .save()
        .then((expense) => {
            // Poblar los campos status y category
            return ExpenseModel.populate(expense, { path: 'status category' });
        })
        .then((populatedExpense) => populatedExpense.toObject());
};

export const deleteExpenseById = (id: String) => ExpenseModel.findOneAndDelete({_id: id});