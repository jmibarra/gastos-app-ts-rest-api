import mongoose, { Schema, Types } from "mongoose";

interface IInvestment {
    name: string;
    averagePurchasePrice: number;
    quantity: number;
    type: string;
    owner: Types.ObjectId;
}

const InvestmentSchema = new mongoose.Schema<IInvestment>({
    name: { type: String, required: true},
    averagePurchasePrice: { type: Number },
    quantity: { type: Number },
    type: { type: String, required: true},
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true}
})

export const InvestmentModel = mongoose.model<IInvestment>('Investment', InvestmentSchema);

export const getInvestments = async (owner: string, limit: number, page: number) => {
    const skipCount = (page - 1) * limit;

    return InvestmentModel.find({
        'owner': owner
    }).skip(skipCount)
    .limit(limit);
}

export const getInvestmentsCount = async (owner: string) => {
    return InvestmentModel.countDocuments({
        'owner': owner
    });
}

export const getInvestmentsById = async (id: string) => {
    return (await InvestmentModel.findById(id)).populate('owner');
}

export const createInvestment = (values: Record<string, any>) => new InvestmentModel(values).save().then((saving) => {return InvestmentModel.populate(saving, { path: 'owner' })}).then((populatedInvestment) => populatedInvestment.toObject());
export const deleteInvestmentById = (id: String) => InvestmentModel.findOneAndDelete({_id: id});