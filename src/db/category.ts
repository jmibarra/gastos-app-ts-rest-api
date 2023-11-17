import mongoose, { Schema } from "mongoose";

interface ICategory {
    name: string;
    color: string;
    icon: string;
    owner: string;
}

const categorySchema = new Schema<ICategory>({
    name: { type: String, required: true},
    color: { type: String, default: "#bcbcbc"},
    icon: { type: String},
    owner: { type: String, required: true}
});

export const CategoryModel = mongoose.model('Category',categorySchema);

export const getCategoriesByOwner = (ownerId: string, limit: number, page: number) => {
    const skipCount = (page - 1) * limit; // Calcular la cantidad de documentos que se deben omitir para la paginación

    return CategoryModel.find({
        'owner': ownerId
    })
    .skip(skipCount) // Omitir los documentos según el cálculo anterior
    .limit(limit); // Limitar la cantidad de documentos devueltos por página
};

export const getCategoriesCountByOwner = (ownerId: string) => {
    return CategoryModel.countDocuments({
        'owner': ownerId
    });
};

export const getCategoryById = (id: string) => CategoryModel.findById(id);
export const createCategory = (values: Record<string, any>) => new CategoryModel(values).save().then((category) => category.toObject());
export const deleteCategoryById = (id: String) => CategoryModel.findOneAndDelete({_id: id});