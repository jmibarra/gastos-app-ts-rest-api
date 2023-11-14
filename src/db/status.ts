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

export const getStatusByOwner = (ownerId: string, limit: number, page: number) => {
    const skipCount = (page - 1) * limit; // Calcular la cantidad de documentos que se deben omitir para la paginación

    return StatusModel.find({
        'owner': ownerId
    })
    .skip(skipCount) // Omitir los documentos según el cálculo anterior
    .limit(limit); // Limitar la cantidad de documentos devueltos por página
};

export const getStatusCountByOwner = (ownerId: string) => {
    return StatusModel.countDocuments({
        'owner': ownerId
    });
};

export const getStatusById = (id: string) => StatusModel.findById(id);
export const createStatus = (values: Record<string, any>) => new StatusModel(values).save().then((status) => status.toObject());
export const deleteStatusById = (id: String) => StatusModel.findOneAndDelete({_id: id});