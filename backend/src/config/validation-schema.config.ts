import z from "zod";

import { EAvailability } from "../models/profile.model";
import { ERole } from "../models/user.model";
import { profile } from "console";

export const userSignUpSchema = z.object({
  username: z
    .string()
    .regex(/^[a-z0-9._]+$/, {
      message:
        "Username can only contain lowercase letters, numbers, dots and underscores.",
    })
    .min(3, { message: "Username must be at least 3 characters long" })
    .refine((value) => value === value.toLowerCase(), {
      message: "Username must be in lowercase",
    }),
  email: z.string().email("Invalid email address."),
  name: z.string().min(1, "Name is required."),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      }
    ),
    role: z.enum([ERole.DEVELOPER, ERole.RECRUITER],{
      required_error: 'Role is required. Either as developer or recruiter.',
    }),
});

export const profileSchema = z.object({
  bio: z.string().max(500, 'Max bio limit reached.'),
  website: z.string(),
  location: z.string(),
  availability: z.enum([EAvailability.FREELANCE, EAvailability.NOT_LOOKING, EAvailability.OPEN]).default(EAvailability.FREELANCE),
  experience_in_year: z.number().default(0),
  worked_at: z.string().max(200, 'Max limit reached.').default(''),
  skills: z.array(z.string()).min(1, 'At least one skill is required.'),
});

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().min(1, 'Description is required.'),
  tech_stack: z.array(z.string()).min(1, 'At least one tech stack is required.'),
  github_url: z.string().url('Invalid GitHub URL.'),
  demo_url: z.string().url('Invalid Demo URL.').optional(),
});


export const companySchema = z.object({
    name: z.string().min(1, 'Company name is required.'),
    address: z.string().min(1, 'Address is required.'),
    website: z.string().min(1, 'Website is required.'),
    industry: z.string().min(1, 'Industry is required.'),
    established_year: z.number().max(new Date().getFullYear(), 'Established year seems invalid.'),
    description: z.string().min(1, 'Description is required.').max(1000, 'Max description limit reached.'),
    logo_url: z.string().url('Invalid Logo URL.'),
    email: z.string().email('Invalid company email.'),
});