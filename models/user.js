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
    default: '', 
  },
  banner: {
    type: String,
    default: '', 
  },
  password: {
    type: String, 
  },
  follows: [{
    type: Schema.Types.ObjectId, 
    ref: 'User', // Reference to other users
    default: [], // Initialize with an empty array
  }],
  followers: [{
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    default: [], // Initialize with an empty array
  }],
  bookmarks: [{
    type: Schema.Types.ObjectId, 
    ref: 'Prompt', 
    default: [], // Initialize with an empty array
  }],
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

userSchema.index({ follows: 1 });
userSchema.index({ followers: 1 });

const User = models.User || model('User', userSchema);

export default User;
