"use client";

import React from "react";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Button from "../../components/Button";

const PricingCard = ({ title, price, description, features, buttonText, buttonLink, isHighlighted = false }) => {
  return (
    <div className={`relative bg-gray-800 bg-opacity-90 rounded-lg shadow-lg border ${isHighlighted ? "border-teal-400/50" : "border-gray-700"} p-8 flex flex-col justify-between w-full max-w-sm mx-auto transition-all duration-200 hover:shadow-teal-400/30`}>
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-2xl font-semibold ${isHighlighted ? "text-teal-300" : "text-white"}`}>{title}</h3>
          {isHighlighted && (
            <span className="text-xs font-semibold text-teal-400 bg-teal-400/20 px-3 py-1 rounded-full">Most Popular</span>
          )}
        </div>
        <p className="text-4xl font-bold text-white mb-2">{price}<span className="text-lg text-gray-400">/month</span></p>
        <p className="text-gray-400 text-sm mb-6">{description}</p>
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <svg className="w-5 h-5 text-teal-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-300 text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <Button href={buttonLink} variant={isHighlighted ? "primary" : "secondary"}>{buttonText}</Button>
    </div>
  );
};

const FAQItem = ({ question, answer }) => {
  return (
    <div className="border-b border-gray-700 py-6">
      <h3 className="text-lg font-semibold text-white mb-2">{question}</h3>
      <p className="text-gray-400 text-sm">{answer}</p>
    </div>
  );
};

const Pricing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Header />

      <section className="relative flex flex-col items-center justify-center text-center min-h-[30rem] px-4 sm:px-6">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 max-w-3xl leading-tight">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-2xl ">
          Choose a plan that fits your business needs and scale effortlessly with Buizbot.
        </p>
      </section>

      <section className=" px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            <PricingCard
              title="Starter"
              price="$9"
              description="Perfect for small businesses getting started with AI support."
              features={[
                "Up to 500 chats/month",
                "AI-powered responses",
                "Basic analytics",
                "Email support",
              ]}
              buttonText="Get Started"
              buttonLink="/register"
            />
            <PricingCard
              title="Growth"
              price="$29"
              description="Ideal for growing teams needing advanced features."
              features={[
                "Up to 2,000 chats/month",
                "Custom training data",
                "Advanced analytics",
                "Human agent transfer",
                "Priority support",
              ]}
              buttonText="Get Started"
              buttonLink="/register"
              isHighlighted={true}
            />
            <PricingCard
              title="Enterprise"
              price="Custom"
              description="Tailored solutions for large organizations."
              features={[
                "Unlimited chats",
                "Dedicated support",
                "Custom integrations",
                "Priority analytics",
                "SLA guarantees",
              ]}
              buttonText="Contact Us"
              buttonLink="/contact"
            />
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 bg-gray-900/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <FAQItem
              question="What payment methods are accepted?"
              answer="We accept major credit cards, PayPal, and bank transfers for Enterprise plans."
            />
            <FAQItem
              question="Can I upgrade my plan later?"
              answer="Yes, you can upgrade or downgrade your plan at any time from your dashboard."
            />
            <FAQItem
              question="Is there a free trial?"
              answer="Yes, all plans come with a 14-day free trial to explore Buizbot features."
            />
            <FAQItem
              question="What happens if I exceed my chat limit?"
              answer="You’ll be notified, and you can upgrade your plan or purchase additional credits."
            />
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Ready to Transform Your Support?
        </h2>
        <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Start with a free trial and see how Buizbot can elevate your customer experience.
        </p>
        <Button href="/register" variant="primary">Start Free Trial</Button>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;