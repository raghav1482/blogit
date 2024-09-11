import User from '@models/user';
import bcrypt from 'bcrypt';
import { connectDB } from '@app/utils/database';

export const POST = async (req, res) => {
  const { email, password, username,image } = await req.json();
  await connectDB();

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: 'User already exists' }), { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      email,
      username,
      password: hashedPassword,
      image, // You can add an image field if required
    });

    return new Response(JSON.stringify({ message: 'User registered successfully' }), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
};
