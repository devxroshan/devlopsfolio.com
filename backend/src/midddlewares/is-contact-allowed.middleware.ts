import express from 'express'
import mongoose from 'mongoose'
import AppError from '../utils/appError'
import ContactRequest from '../models/contact-request.model'

export const isContactAllowed = async (
  req: express.Request,
  res: express.Response, next: express.NextFunction
) => {
    const {receiver_id} = req.query

    if (!req.signedInUser?.id || !receiver_id || !mongoose.isValidObjectId(req.signedInUser?.id) || !mongoose.isValidObjectId(receiver_id))
        throw new AppError('Invalid Sender Id or Receiver Id', 400)

    const contact = await ContactRequest.findOne({
        $or: [
            {recruiter_id:req.signedInUser?.id, developer_id:receiver_id},
            {recruiter_id: receiver_id, developer_id: req.signedInUser?.id}
        ],
        is_accepted: true
    })

    if (!contact)
        throw new AppError('Contact not allowed', 403)

    next()
}