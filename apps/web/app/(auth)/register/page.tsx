"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { registerUser } from "../../../actions/authAction";
import { signIn } from "next-auth/react";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (data: RegisterFormData) => {
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      const res = await registerUser(formData);
      if (res.success) {
        setMessage("Registration successful! Redirecting...");
        reset();
        setTimeout(() => setMessage(null), 3000);
        signIn()

      } else {
        setMessage(res.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      setMessage("An unexpected error occurred. Please try again.");
      console.error("Registration error:", error);
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center text-white p-6">
      <div className="w-full max-w-md bg-gray-800 bg-opacity-70 backdrop-blur-md p-8 rounded-xl shadow-lg border border-teal-400/30">
        <h1 className="text-3xl font-bold text-center text-teal-400 mb-6">
          Register
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Create your account to unlock premium features and secure messaging.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Full Name
            </label>
            <input
              {...register("name")}
              type="text"
              id="name"
              placeholder="Enter your full name"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Email Address
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              id="password"
              placeholder="Create a password"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300"
              disabled={isSubmitting}
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-gradient-to-r from-teal-500 to-purple-600 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-purple-700 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Create Account"}
          </button>

          {message && (
            <p
              className={`text-center mt-4 ${
                message.includes("successful")
                  ? "text-teal-400"
                  : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <button
            onClick={() => signIn()}
            className="text-teal-300 underline hover:text-teal-400 cursor-pointer"
          >
            Sign in here
          </button>
          .
        </p>
      </div>
    </div>
  );
};

export default Register;
