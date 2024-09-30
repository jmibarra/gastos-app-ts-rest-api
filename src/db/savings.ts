import mongoose, { Document, Schema, Types } from "mongoose";

interface ISaving {
    period: string;
    description: string;
    amount: number;
    date: Date;
    type: string;
    owner: Types.ObjectId;
}

const SavingSchema = new mongoose.Schema<ISaving>({
    period: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    date: {
        type: Date
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
    
})

export const SavingModel = mongoose.model<ISaving>('Saving', SavingSchema);

export const getSavingsByPeriod = (ownerId: string, period: String, limit: number, page: number) => {
    const skipCount = (page - 1) * limit;

    return SavingModel.find({
        'owner': ownerId,
        'period': period
    }).populate('owner')
    .skip(skipCount)
    .limit(limit);
}

export const getSavingsCountByPeriod = (ownerId: string, period: string) => {
    return SavingModel.countDocuments({
        'owner': ownerId,
        'period': period,
    });
};

export const getSavings = (ownerId: string, limit: number, page: number) => {
    const skipCount = (page - 1) * limit;

    return SavingModel.find({
        'owner': ownerId
    }).populate('owner')
    .skip(skipCount)
    .limit(limit);
}

export const getSavingsCount = (ownerId: string) => {
    return SavingModel.countDocuments({
        'owner': ownerId
    });
}

export const getSavingById = (id: string) => SavingModel.findById(id).populate('owner');
export const createSaving = (values: Record<string, any>) => new SavingModel(values).save().then((saving) => {return SavingModel.populate(saving, { path: 'owner' })}).then((populatedIncome) => populatedIncome.toObject());
export const deleteSavingById = (id: String) => SavingModel.findOneAndDelete({_id: id});
