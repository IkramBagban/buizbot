import prisma from "@repo/db";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "email",
          placeholder: "Enter your email",
          type: "text",
        },
        password: {
          label: "password",
          placeholder: "Enter your password",
          type: "password",
        },
      },

      authorize: async (credentials: { email: string; password?: string }) => {
        console.log("credentials", credentials);

        const { email, password } = credentials;
        if (!email || !password) {
          console.log("password or email is not provided", credentials);
          return null;
        }
        const user: {
          id: number;
          name: string;
          email: string;
          password?: string;
        } | null = await prisma.user.findFirst({
          where: { email: credentials?.email },
        });

        console.log("user", user);
        if (!user) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(password, user.password!);
        console.log("passwordMathc", passwordMatch);

        if (!passwordMatch) {
          console.log("Password doesn't match");
          return null;
        }

        delete user.password;
        return user;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, 
  pages: {
    signIn: "/signin",
  },


};

export default authOptions;
