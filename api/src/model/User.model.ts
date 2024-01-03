import crypto from 'crypto'
import mongoose, {
  type Document,
  type CallbackError,
  type Schema,
  type Model,
  type ObjectId
} from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { EmailVerification } from './EmailVerification.model'
interface IUser extends Document {
  fullname: string
  email: string
  password: string
  tokens: Array<{ token: string }>
  emailVerification: ObjectId
  createdAt: Date
  updatedAt: Date
  generateRefreshToken: () => Promise<string>
}

export interface IUserModel extends Model <IUser> {

  signin: (email: string, password: string) => Promise<IUser | null>
}

const userSchema: Schema<IUser, IUserModel> = new mongoose.Schema<IUser, IUserModel>(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    emailVerification: {
      type: mongoose.Schema.ObjectId,
      ref: 'EmailVerification'
    },
    tokens: [
      {
        token: {
          type: String,
          required: true
        }
      }
    ]
  },
  { timestamps: true }
)

userSchema.pre('save', async function (next: (error?: CallbackError) => void) {
  try {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 14)
    }
    // TODO: remove and split it for re-usability
    const verfication = new EmailVerification({
      token: crypto.randomBytes(62).toString('hex')
    })

    const emailVerification = await verfication.save()
    this.emailVerification = emailVerification._id
    next()
  } catch (error) {
    next(error as CallbackError)
  }
})

userSchema.methods.generateRefreshToken = async function (): Promise<string> {
  const TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET ?? ''
  const TOKEN_VALIDITY = process.env.REFRESH_TOKEN_VALIDITY ?? ''

  const token = jwt.sign(
    {
      uid: this._id.toString()
    },
    TOKEN_SECRET,
    { expiresIn: TOKEN_VALIDITY }
  )

  this.tokens = this.tokens.concat({ token })
  this.save()
  return token
}

userSchema.statics.signin = async function (email: string, password: string) {
  const user = await this.findOne({
    email
  })

  if (user === null) return null

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const isPasswordMatched = await bcrypt.compare(password, user.password)

  if (isPasswordMatched === null) return null

  return user
}

export const User = mongoose.model<IUser, IUserModel>('User', userSchema)
