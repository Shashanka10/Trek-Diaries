import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import dbConnect from "../../lib/mongoose";
import User from "../../lib/modals/User";
import { db } from "@/lib/db/db";
import { loginSchema } from "@/lib/zodSchema/login";

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("Please provide process.env.NEXTAUTH_SECRET env variable.");
}

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log("Connecting to database...");
          await dbConnect(); // establishing connection to mongoDB
          const { email, password } = loginSchema.parse(credentials); // validating the credentials
          
          console.log(`Entered email:${email}\npassword: ${password}`);

          /* check on database here */
          const result: any = await User.findOne({ email: email }); //checking if the user exists
          if (!result) {
            //if the email is unregistered...
            console.log("There is no user registered under this email....");
            return null;
          }

          if (password !== result.password) {
            // if password is incorrect
            console.log(`Password Incorrect....`);
            return null;
          }

          if (result.verified !== true) {
            console.log("User has not been verified....");
            return null;
          }

          console.log(`returning user details: ${result}`); // result is MongoDB Object here.. might need to change into js object later...
          return result;
        } catch {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
      }

      return session;
    },
    async jwt({ token, user }) {
      await dbConnect();
      const dbUser = await User.findOne({ email: token.email });

      if (!dbUser) {
        if (user) {
          token.id = user?.id;
        }
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },
  },
};