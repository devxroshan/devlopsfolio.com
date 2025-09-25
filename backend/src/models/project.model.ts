import mongoose from "mongoose";

export interface IProject extends mongoose.Document {
  userId: mongoose.Schema.Types.ObjectId;
  title: string;
  description: string;
  tech_stack: string[];
  github_url: string;
  demo_url?: string;
  views_count: number;
}

const projectSchema = new mongoose.Schema<IProject>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    tech_stack: { type: [String], required: true },
    github_url: { type: String, required: true },
    demo_url: { type: String },
    views_count: { type: Number, default: 0 },
}, { timestamps: true
})


export default mongoose.model<IProject>("Project", projectSchema);