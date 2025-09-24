import z from "zod";

import { EAvailability } from "../models/profile.model";
import { ERole } from "../models/user.model";

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
    })
});

export const profileSchema = z.object({
  bio: z.string().max(500, 'Max bio limit reached.'),
  website: z.string(),
  location: z.string(),
  availability: z.enum([EAvailability.FREELANCE, EAvailability.NOT_LOOKING, EAvailability.OPEN]).default(EAvailability.FREELANCE),
  experience_in_year: z.number().default(0),
  worked_at: z.string().max(200, 'Max limit reached.').default(''),
});
