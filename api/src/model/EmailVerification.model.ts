import mongoose, {
  type Document,
  type Schema,
  type Model
} from 'mongoose'

interface IEmailVerification extends Document {
  token: string
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}
export interface IEmailVerificationModel extends Model <IEmailVerification> {
}
const emailVerificationSchema: Schema<IEmailVerification, IEmailVerificationModel> = new mongoose.Schema<IEmailVerification, IEmailVerificationModel>({
  token: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: '10m'
  }
}, { timestamps: true })

export const EmailVerification = mongoose.model<IEmailVerification, IEmailVerificationModel>('EmailVerification', emailVerificationSchema)
