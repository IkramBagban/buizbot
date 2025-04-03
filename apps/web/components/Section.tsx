import React from "react";

const Section = ({ children, className = "", title, background = false }) => {
  return (
    <section className={`py-12 px-4 sm:px-6 ${background ? "bg-gradient-to-r from-teal-500/20 to-purple-600/20" : ""} ${className}`}>
      {title && (
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-teal-400 mb-10">
          {title}
        </h2>
      )}
      <div className="relative max-w-7xl mx-auto">
        {children}
      </div>
    </section>
  );
};

export default Section;