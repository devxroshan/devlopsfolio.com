import mongoose from 'mongoose';
import { Schema } from 'mongoose';

export interface ICompany extends mongoose.Document {
    userId: Schema.Types.ObjectId;
    name: string;
    address: string;
    website: string;
    industry: string;
    established_year: number;
    description: string;
    logo_url: string;
}


const companySchema: Schema<ICompany> = new Schema<ICompany>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: [true, 'Company name is required.'], unique: [true, 'Company name must be unique.'] },
    address: { type: String, required: [true, 'Address is required.'] },
    website: { type: String, required: [true, 'Website is required.'] },
    industry: { type: String, required: [true, 'Industry is required.'] },
    established_year: { type: Number, required: [true, 'Established year is required.'] },
    description: { type: String, required: [true, 'Description is required.'] },
    logo_url: { type: String, required: [true, 'Logo URL is required.'] },
}, { timestamps: true });

export default mongoose.model<ICompany>('Company', companySchema);