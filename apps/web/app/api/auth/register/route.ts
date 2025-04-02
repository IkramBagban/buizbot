import { NextRequest } from "next/server";
import prisma from "@repo/db";
import bcrypt from "bcrypt";

export const POST = async (req: NextRequest) => {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return Response.json(
      { message: "name, email and password are required fields" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
    select: { id: true },
  });

  if (user) {
    return Response.json(
      {
        message:
          "Existing email please try loging in or try different email to register.",
      },
      { status: 409 }
    );
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashedPassword,
    },
  });

  return Response.json(
    {
      message: "User created successfully",
      data: newUser,
    },
    { status: 201 }
  );
};
