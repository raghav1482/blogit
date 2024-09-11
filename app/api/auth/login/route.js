import User from '@models/user';
import bcrypt from 'bcrypt';
import { connectDB } from '@app/utils/database';

export const POST = async (req) => {
  const { email, password } = await req.json();
  await connectDB();

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ message: 'No user found with this email' }), { status: 400 });
    }

    // Validate the password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return new Response(JSON.stringify({ message: 'Incorrect password' }), { status: 400 });
    }

    // Successful login
    return new Response(JSON.stringify({ message: 'Login successful' }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
};
