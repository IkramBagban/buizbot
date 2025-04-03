import React from "react";

const FeatureCard = ({ title, description, author }) => {
  return (
    <div className="relative bg-gray-800 bg-opacity-70 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-teal-400/40 hover:shadow-teal-400/30 transition-all duration-300">
      <h3 className={`text-lg sm:text-xl font-semibold ${author ? "text-teal-400" : "text-white"} mb-3`}>
        {title}
      </h3>
      <p className="text-gray-300 text-sm sm:text-base">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;