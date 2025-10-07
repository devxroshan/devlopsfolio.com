import express from 'express';
import mongoose from 'mongoose';


// Models
import companyModel, {ICompany} from '../models/company.model';

// Middlewares


// Utils
import { AsyncRequestHandler } from '../utils/asyncRequestHandler';
import AppError from '../utils/appError';


const createCompany = async (req: express.Request, res:express.Response):Promise<void> => {
    const compnayInfo:Partial<ICompany> = req.body;
    const {createAnyWay} = req.query;

    const existingCompany = await companyModel.findOne({userId: req.signedInUser?.id});
    if(existingCompany && (!createAnyWay || createAnyWay !== 'true')){
        throw new AppError('Company already exists for this user', 400);
    }

    if(existingCompany && createAnyWay === 'true'){
        await companyModel.findByIdAndDelete(existingCompany._id);
    }

    const newCompany = await companyModel.create({
        recruiter_id: req.signedInUser?.id,
        ...compnayInfo
    });

    if(!newCompany){
        throw new AppError('Failed to create company', 500);
    }

    res.status(201).json({
        ok: true,
        msg: 'Company created successfully',
        data: newCompany
    });
}

const updateCompany = async (req: express.Request, res:express.Response):Promise<void> => {
    const updatedInfo:Partial<ICompany> = req.body;


    if(Object.keys(updatedInfo).length === 0){
        throw new AppError('No data provided to update', 400);
    }

    const existingCompany = await companyModel.findOne({userId: req.signedInUser?.id});
    if(!existingCompany){
        throw new AppError('Company not found', 404);
    }

    const updatedCompany = await companyModel.findByIdAndUpdate(existingCompany._id, updatedInfo, {new: true, runValidators: true});

    if(!updatedCompany){
        throw new AppError('Failed to update company', 500);
    }

    res.status(200).json({
        ok: true,
        msg: 'Company updated successfully',
        data: updatedCompany
    });
}

const changeCompanyIcon = async (req: express.Request, res:express.Response):Promise<void> => {
    // Functionality to be implemented later.
    res.status(200).json({
        ok: true,
        msg: 'Change company icon - Not implemented yet',
    });
}

const removeCompanyIcon = async (req: express.Request, res:express.Response):Promise<void> => {
    // Functionality to be implemented later.
    res.status(200).json({
        ok: true,
        msg: 'Company icon removed - Not implemented yet',
    });
}

const deleteCompany = async (req: express.Request, res:express.Response):Promise<void> => {
    const existingCompany = await companyModel.findOne({userId: req.signedInUser?.id});
    if(!existingCompany){
        throw new AppError('Company not found', 404);
    }
    const deletedCompany = await companyModel.findByIdAndDelete(existingCompany._id);

    if(!deletedCompany){
        throw new AppError('Failed to delete company', 500);
    }
    res.status(200).json({
        ok: true,
        msg: 'Company deleted successfully',
    });
}

export const CreateCompany = AsyncRequestHandler(createCompany);
export const UpdateCompany = AsyncRequestHandler(updateCompany);
export const ChangeCompanyIcon = AsyncRequestHandler(changeCompanyIcon);
export const RemoveCompanyIcon = AsyncRequestHandler(removeCompanyIcon);
export const DeleteCompany = AsyncRequestHandler(deleteCompany);