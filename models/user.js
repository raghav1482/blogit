import { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
  email: {
    type: String,
    unique: [true, 'Email already exists'],
    required: [true, 'Email is required!'],
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
  },
  image: {
    type: String,
  },
  banner: {
    type: String,
  },
  password: {
    type: String,
  },
  follows: [{
    type: Schema.Types.ObjectId, 
    ref: 'User', // Assuming the 'follows' array contains references to other users
  }],
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

const User = models.User || model('User', userSchema);

export default User;
