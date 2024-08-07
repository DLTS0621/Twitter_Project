import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import clientPromise from '@/lib/mongodb';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/login', // Custom sign-in page
  },
  session: {
    strategy: 'jwt', // Use JWT for sessions
  },
  callbacks: {
    async session({ session, token }) {
      // This callback is fired whenever a session is checked
      // You can customize the session object here
      console.log('Token:', token);
      console.log('Session:', session);

      // You can add custom properties to the session object here
      if (session?.user && token?.sub) {
        session.user.id = token.sub; // Add user ID to session
      }
      return session; // Return the session object
    },
  },
};

export default NextAuth(authOptions);
