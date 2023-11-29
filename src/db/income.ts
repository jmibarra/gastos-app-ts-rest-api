import mongoose, { Document, Schema, Types } from "mongoose";


interface IIncome extends Document {
    title: string;
    date: Date;
    period: String;
    status : Types.ObjectId;
    amount: number;
    type: string;
    owner: Types.ObjectId;
}

const IncomeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date
    },
    period: {
        type: String,
        required: true
    },
    status: {
        type: Schema.Types.ObjectId,
        ref: 'Status',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

export const IncomeModel = mongoose.model<IIncome>('Income', IncomeSchema)

export const getIncomesByPeriod = (ownerId: string, period: String, limit: number, page: number) => {
    const skipCount = (page - 1) * limit;

    return IncomeModel.find({
        'owner': ownerId,
        'period': period
    }).populate('status')
    .populate('owner')
    .skip(skipCount)
    .limit(limit);
};

export const getIncomesCountByPeriod = (ownerId: string, period: string) => {
    return IncomeModel.countDocuments({
        'owner': ownerId,
        'period': period,
    });
};

export const getIncomeById = (id: string) => IncomeModel.findById(id).populate('status').populate('owner');
export const createIncome = (values: Record<string, any>) => new IncomeModel(values).save().then((income) => income.toObject());
export const deleteIncomeById = (id: String) => IncomeModel.findOneAndDelete({_id: id});