import mongoose, { Document, Schema, Model } from "mongoose";

// Interfaz para el subdocumento "Status"
interface IStatus {
    name: string;
    color: string;
    owner: string;
}

// Definir el esquema para el subdocumento "Status"
const statusSchema = new Schema<IStatus>({
    name: { type: String, required: true},
    color: { type: String},
    owner: { type: String, required: true}
});

export const StatusModel = mongoose.model('Status', statusSchema);

export const getStatusById = (id: string) => StatusModel.findById(id);
export const createStatus = (values: Record<string, any>) => new StatusModel(values).save().then((status) => status.toObject());
export const deleteStatusById = (id: String) => StatusModel.findOneAndDelete({_id: id});
export const updateStatusById = ((id: String, values: Record<string, any>) => StatusModel.findByIdAndUpdate(id, values));