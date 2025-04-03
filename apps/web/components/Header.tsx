"use client";

import React, { useState } from "react";
import Link from "next/link";
import Button from "./Button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-80 backdrop-blur-lg border-b border-teal-400/40 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-4 sm:px-6">
        <Link href="/">
          <h1 className="text-2xl font-bold text-teal-400 tracking-wide cursor-pointer hover:text-teal-300 transition-all duration-300">Buizbot</h1>
        </Link>

        <button
          className="md:hidden text-teal-400 focus:outline-none cursor-pointer hover:text-teal-300 transition-all duration-300"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>

        <nav className={`${isMenuOpen ? "block" : "hidden"} md:flex md:space-x-6 absolute md:static top-16 right-4 md:right-auto bg-gray-900 bg-opacity-90 p-4 md:p-0 rounded-lg md:bg-transparent w-48 md:w-auto`}>
          <Link href="/features" className="block text-gray-300 hover:text-teal-400 transition-all duration-300 py-2 md:py-0 cursor-pointer" onClick={() => setIsMenuOpen(false)}>
            Features
          </Link>
          <Link href="/pricing" className="block text-gray-300 hover:text-teal-400 transition-all duration-300 py-2 md:py-0 cursor-pointer" onClick={() => setIsMenuOpen(false)}>
            Pricing
          </Link>
          <Link href="/about" className="block text-gray-300 hover:text-teal-400 transition-all duration-300 py-2 md:py-0 cursor-pointer" onClick={() => setIsMenuOpen(false)}>
            About
          </Link>
          <Link href="/contact" className="block text-gray-300 hover:text-teal-400 transition-all duration-300 py-2 md:py-0 cursor-pointer" onClick={() => setIsMenuOpen(false)}>
            Contact
          </Link>
        </nav>

        <div className="flex space-x-3">
          <Button href="/signin" variant="secondary">Sign In</Button>
          <Button href="/register" variant="primary">Sign Up</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;