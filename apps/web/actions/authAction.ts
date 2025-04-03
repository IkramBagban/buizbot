"use server";

import prisma from "@repo/db";
import bcrypt from "bcrypt";

import { getServerSession } from "next-auth";
import authOptions from "../app/lib/auth";

export async function checkAuthentication() {
  const session = await getServerSession(authOptions);
  return !!session?.user?.email;
}

export const registerUser = async (formData: FormData) => {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
      return { message: "All fields are required!" };
    }

    const existingUser = await prisma.user.findFirst({ where: { email } });

    if (existingUser) {
      return {
        message: "Email already exists. Try logging in!",
        success: false,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return { message: "User registered successfully!", success: true };
  } catch (error) {
    console.log("error", error);
    return {
      message: "Something went wrong, please try again!",
      success: false,
    };
  }
};
