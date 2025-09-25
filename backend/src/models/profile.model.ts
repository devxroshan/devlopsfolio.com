import mongoose from 'mongoose'


export enum EAvailability {
    OPEN = 'open',
    NOT_LOOKING = 'not_looking',
    FREELANCE = 'freelance'
}

export enum EField {
    BIO = 'bio',
    WEBSITE = 'website',
    SOCIAL_MEDIA_LINKS = 'social_media_links',
    LOCATION = 'location',
    AVAILABILITY = 'availability',
    EXPERIENCE_IN_YEAR = 'experience_in_year',
    WORKED_AT = 'worked_at'
}

export interface IProfile extends mongoose.Document {
    userId: mongoose.Schema.Types.ObjectId,
    bio: string,
    profile_pic: string,
    website: string,
    social_media_links: [string],
    location: string,
    availability: EAvailability,
    experience_in_year: number,
    worked_at: string
}

const profileSchema:mongoose.Schema<IProfile> = new mongoose.Schema<IProfile>({
    userId: {type:mongoose.Schema.Types.ObjectId, required: [true, 'UserId required.'], ref:'User', unique: [true, 'Profile for this user already exists.']},
    bio: {type: String, default: ""},
    profile_pic: {type: String, default: ""},
    website: {type: String, default: ""},
    social_media_links: [{type: String}],
    location: {type: String, default: ''},
    availability:{type: String, enum: EAvailability, default: EAvailability.FREELANCE},
    experience_in_year: {type: Number, default: 0},
    worked_at: {type: String}
}, {timestamps: true})

export default mongoose.model<IProfile>('Profile', profileSchema)