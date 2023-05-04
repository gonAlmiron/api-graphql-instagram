import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  token: { type: String, required: true, unique: true },
  profileIg: {type: String, unique: true}
},
{timestamps: true}
)
export const UserModel = model('user', UserSchema);