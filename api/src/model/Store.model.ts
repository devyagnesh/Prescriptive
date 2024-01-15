import mongoose, { type CallbackError, Schema, type Model } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IPhoneNumberVerification {
  otp: string
  isVerified: boolean
}

export interface IStore extends Document {
  storename: string
  addressLine1: string
  addressLine2?: string
  phoneNumber: string
  verification: IPhoneNumberVerification
  generateOtp: () => number
}

export interface IStoreModel extends Model <IStore> {
}

const storeSchema: Schema<IStore> = new Schema<IStore>({
  storename: {
    type: String,
    required: true,
    trim: true,
    lowecase: true
  },

  addressLine1: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },

  addressLine2: {
    type: String,
    lowercase: true,
    trim: true
  },

  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },

  verification: {
    otp: {
      type: String,
      required: true
    },

    isVerified: {
      type: Boolean,
      required: true,
      default: false
    }
  }
}, { timestamps: true, autoIndex: true })

storeSchema.pre('save', async function (next: (error?: CallbackError) => void) {
  try {
    if (this.isModified('verification')) {
      this.verification.otp = await bcrypt.hash(this.verification.otp, 8)
    }
    next()
  } catch (error) {
    next(error as CallbackError)
  }
})

storeSchema.methods.generateOtp = async function (): Promise<number> {
  const otp: number = Math.floor(Math.random() * 1000000)
  this.verification.otp = otp
  return otp
}

export const Store = mongoose.model<IStore, IStoreModel>('Store', storeSchema)
