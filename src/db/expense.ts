import mongoose, { Document, Schema, Model, Types } from "mongoose";



// Interfaz para el subdocumento "Periodo"
interface IPeriod {
    name: string;
    startDate: Date;
    endDate: Date;
    current: boolean;
}

interface IExpense extends Document {
    title: string;
    dueDate: Date;
    status : Types.ObjectId;
    period : IPeriod;
    category: Types.ObjectId;
    amount: number;
    type: string;
    owner: string;
}

// Definir el esquema para el subdocumento "Periodo"
const periodSchema = new Schema<IPeriod>({
    name: { type: String, required: true},
    startDate: { type: Date, required: true},
    endDate: { type: Date, required: true},
    current: { type: Boolean, required: true},
});

// Definir el esquema principal con los subdocumentos "Status" y "Periodo"
const expenseSchema = new Schema<IExpense>({
    title: { type: String, required: true},
    dueDate: { type: Date },
    status : { type: Schema.Types.ObjectId, ref: 'Status' },
    period : periodSchema,
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    amount: {type: Number},
    type: { type: String},
    owner: { type: String, required: true}
  });

export const ExpenseModel = mongoose.model('Expense', expenseSchema);

export const getExpenseByOwner = (ownerId: string, limit: number, page: number) => {
    const skipCount = (page - 1) * limit; // Calcular la cantidad de documentos que se deben omitir para la paginación

    return ExpenseModel.find({
        'owner': ownerId
    }).populate('status')
    .populate('category')
    .skip(skipCount) // Omitir los documentos según el cálculo anterior
    .limit(limit); // Limitar la cantidad de documentos devueltos por página
};
export const getExpensesCountByCreator = (ownerId: string) => {
    return ExpenseModel.countDocuments({
        'owner': ownerId
    });
};
export const getExpenseById = (id: string) => ExpenseModel.findById(id);
export const createExpense = (values: Record<string, any>) => new ExpenseModel(values).save().then((note) => note.toObject());
export const deleteExpenseById = (id: String) => ExpenseModel.findOneAndDelete({_id: id});
export const updateExpenseById = ((id: String, values: Record<string, any>) => ExpenseModel.findByIdAndUpdate(id, values));