import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  facebookId: { type: String, required: true, unique: true },
},
{timestamps: true}
)
export const UserModel = model('user', UserSchema);