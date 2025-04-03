import React from "react";
import Link from "next/link";

const Button = ({ href, children, variant = "primary" }) => {
  const baseStyles = "px-6 py-3 sm:px-8 sm:py-3 font-semibold rounded-lg transition-all duration-300 text-sm sm:text-base cursor-pointer";
  const variantStyles = variant === "primary"
    ? "bg-gradient-to-r from-teal-500 to-purple-600 text-white hover:from-teal-600 hover:to-purple-700"
    : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-teal-400";

  return href ? (
    <Link href={href}>
      <button className={`${baseStyles} ${variantStyles}`}>
        {children}
      </button>
    </Link>
  ) : (
    <button className={`${baseStyles} ${variantStyles}`}>
      {children}
    </button>
  );
};

export default Button;