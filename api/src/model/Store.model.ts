import mongoose, {
  type Document,
  type CallbackError,
  Schema,
  type Model,
  type PopulatedDoc
} from 'mongoose'

export interface IStore extends Document {
  store_name: string
  phone_number: string
  addressLine1: string
  addressLine2: string
  state: string
  city: string
  pincode: number
  isPhoneVerified: boolean
}

export interface IStoreModel extends Model<IStore> {

}

const storeSchema: Schema<IStore> = new Schema<IStore>({
  store_name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },

  phone_number: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },

  addressLine1: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },

  addressLine2: {
    type: String,
    trim: true,
    lowercase: true
  },

  state: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },

  city: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },

  pincode: {
    type: Number,
    required: true,
    min: 6,
    max: 6,
    trim: true
  },

  isPhoneVerified: {
    type: Boolean,
    required: true,
    default: false
  }
})

export const Store = mongoose.model('stores', storeSchema)
