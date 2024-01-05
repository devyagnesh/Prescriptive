import mongoose, {
  type Document,
  type CallbackError,
  type Schema,
  type Model,
  type PopulatedDoc
} from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { type IEmailVerification } from './EmailVerification.model'
export interface IUser extends Document {
  fullname: string
  email: string
  password: string
  tokens: Array<{ token: string }>
  emailVerification: PopulatedDoc<IEmailVerification>
  isEmailVerified: boolean
  createdAt: Date
  updatedAt: Date
  generateRefreshToken: () => Promise<any>
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
    isEmailVerified: {
      type: Boolean,
      required: true,
      default: false
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

    next()
  } catch (error) {
    next(error as CallbackError)
  }
})

userSchema.methods.generateRefreshToken = async function (): Promise<any> {
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
  return { user: this, token }
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
