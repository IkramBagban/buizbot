import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="py-6 px-4 sm:px-6 border-t border-gray-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-gray-500 text-sm">
        <p>© 2025 Buizbot. All rights reserved.</p>
        <div className="flex flex-row space-y-2 space-x-4  mt-0">
          <Link href="/terms" className="text-teal-300 hover:text-teal-400">
            Terms of Service
          </Link>
          <Link href="/privacy" className="text-teal-300 hover:text-teal-400">
            Privacy Policy
          </Link>
          <Link href="/contact" className="text-teal-300 hover:text-teal-400">
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
