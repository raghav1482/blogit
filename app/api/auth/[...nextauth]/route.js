import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '@models/user';
import { connectDB } from '@app/utils/database';
import bcrypt from 'bcrypt';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'your-email@example.com' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        await connectDB();
        // Find user by email
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error('No user found with this email');
        }

        // Compare the entered password with the hashed password
        const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        if (!isValidPassword) {
          throw new Error('Incorrect password');
        }

        // If login is successful, return the user object
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.username,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session }) {
      try {
        await connectDB();
        const sessionUser = await User.findOne({ email: session.user.email });
        if (sessionUser) {
          session.user.id = sessionUser._id.toString();
        } else {
          console.log("No user found for this session.");
        }
      } catch (error) {
        console.error("Error fetching session user:", error);
      }
      return session;
    },

    async signIn({ account, profile, user, credentials }) {
      try {
        await connectDB();

        // Handle sign-in via Google
        if (account.provider === 'google') {
          const userExists = await User.findOne({ email: profile.email });
          if (!userExists) {
            await User.create({
              email: profile.email,
              username: profile.name.replace(" ", "").toLowerCase(),
              image: profile.picture,
            });
          }
          return true;
        }

        // Handle sign-in via Credentials
        if (account.provider === 'credentials') {
          return !!user; // If the user is found and authorized in authorize function, allow sign-in
        }

        return true;
      } catch (error) {
        console.error("Error during sign-in:", error);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
