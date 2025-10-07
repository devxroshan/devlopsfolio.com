import mongoose from "mongoose";

interface IContactRequest extends mongoose.Document {
  recruiter_id: mongoose.Schema.Types.ObjectId;
  developer_id: mongoose.Schema.Types.ObjectId;
  recruiter_name: string;
  recruiter_email: string;
  company_name: string;
  company_email: string;
  is_accepted: boolean;
}

const contactRequestSchema = new mongoose.Schema<IContactRequest>(
  {
    recruiter_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    developer_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    recruiter_name: { type: String, required: true },
    recruiter_email: { type: String, required: true },
    company_name: { type: String, required: true },
    company_email: { type: String, required: true },
    is_accepted: { type: Boolean, default: false },
  },
  { timestamps: true }
);


const ContactRequest = mongoose.model<IContactRequest>("ContactRequest", contactRequestSchema);
export default ContactRequest;