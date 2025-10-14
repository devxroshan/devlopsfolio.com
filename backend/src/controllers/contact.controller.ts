import express from 'express'
import mongoose from 'mongoose';

// Utils
import { AsyncRequestHandler } from '../utils/asyncRequestHandler'
import AppError from '../utils/appError';

// Models
import contactRequestModel from '../models/contact-request.model'
import companyModel from '../models/company.model';

// Enums
import userModel, { ERole } from '../models/user.model'



const contactRequest = async (req: express.Request, res: express.Response):Promise<void> => {
    const developerId = req.query.developer_id;

    if(!developerId || typeof developerId !== 'string' || mongoose.Types.ObjectId.isValid(developerId) === false)
        throw new AppError('A valid developer_id query parameter is required.', 400);

    if(req.signedInUser?.role !== ERole.RECRUITER)
        throw new AppError('Only recruiters can send contact requests.', 403);


    const recruiterCompany = await companyModel.findOne({recruiter_id: req.signedInUser?._id});

    if(!recruiterCompany)
        throw new AppError('You need to have a company registered to send contact requests.', 400);

    const isDeveloper = await userModel.exists({
        _id: developerId,
        role: ERole.DEVELOPER
    })

    if(!isDeveloper)
        throw new AppError("Developer not found.", 404)

    const newContactRequest = await contactRequestModel.create({
          recruiter_id: req.signedInUser?._id,
          developer_id: developerId,
          recruiter_name: req.signedInUser?.name,
          recruiter_email: req.signedInUser?.email,
          company_name: recruiterCompany.name,
          company_email: recruiterCompany.email,
    })

    if(!newContactRequest)
        throw new AppError('Failed to create contact request.', 500);

    res.status(201).json({
        ok: true,
        msg: 'Contact request sent successfully.',
        data: newContactRequest
    });
}


const acceptContactRequest = async (req: express.Request, res: express.Response):Promise<void> => {
    const contactRequestId = req.query.contact_request_id;
    if(!contactRequestId || typeof contactRequestId !== 'string' || mongoose.Types.ObjectId.isValid(contactRequestId) === false)
        throw new AppError('A valid contact_request_id query parameter is required.', 400);

    if(req.signedInUser?.role !== ERole.DEVELOPER)
        throw new AppError('Only developers can accept contact requests.', 403);
    
    const contactRequest = await contactRequestModel.findById(contactRequestId);
    
    if(!contactRequest)
        throw new AppError('Contact request not found.', 404);
    if(contactRequest.developer_id.toString() !== req.signedInUser?.id.toString())
        throw new AppError('You are not authorized to accept this contact request.', 403);
    if(contactRequest.is_accepted === true)
        throw new AppError('Contact request is already accepted.', 400);    

    contactRequest.is_accepted = true;
    await contactRequest.save();

    res.status(200).json({
        ok: true,
        msg: 'Contact request accepted successfully.',
        data: contactRequest
    });
}

const deleteContactRequest = async (req: express.Request, res: express.Response):Promise<void> => {
    const contactRequestId = req.query.contact_request_id;
    if(!contactRequestId || typeof contactRequestId !== 'string' || mongoose.Types.ObjectId.isValid(contactRequestId) === false)
        throw new AppError('A valid contact_request_id query parameter is required.', 400);

    const contactRequest = await contactRequestModel.findOne({$or: [{recruiter_id: req.signedInUser?._id}, {developer_id: req.signedInUser?._id}]});

    if(!contactRequest)
        throw new AppError('Contact request not found.', 404);

    await contactRequest.deleteOne();

    res.status(200).json({
        ok: true,
        msg: 'Contact request deleted successfully.'
    });
}


export const ContactRequest = AsyncRequestHandler(contactRequest)
export const AcceptContactRequest = AsyncRequestHandler(acceptContactRequest)
export const DeleteContactRequest = AsyncRequestHandler(deleteContactRequest)