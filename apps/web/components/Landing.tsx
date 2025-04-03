"use client";

import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Section from "../components/Section";
import FeatureCard from "../components/FeatureCard";
import Button from "../components/Button";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <Header />

      <section className="relative flex flex-col items-center justify-center text-center min-h-[calc(100vh-64px)] px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-purple-600/10"></div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-teal-400 mb-4 max-w-3xl leading-tight">
          Transform Customer Support with AI-Powered Chatbots
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-xl mb-8">
          Buizbot: Intelligent, scalable, and personalized support for your business.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Button href="/register" variant="primary">Start Free Trial</Button>
          <Button href="/signin" variant="secondary">Sign In</Button>
        </div>
      </section>

      <Section title="Why Buizbot Stands Out">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            title="Intelligent AI Responses"
            description="Resolve queries instantly with AI-driven support powered by advanced language models."
          />
          <FeatureCard
            title="Train with Your Data"
            description="Customize the chatbot by uploading your business data for tailored responses."
          />
          <FeatureCard
            title="Seamless Agent Transfers"
            description="Switch to a human agent on demand for personalized support."
          />
          <FeatureCard
            title="Insightful Analytics"
            description="Track users, messages, and response times with powerful stats."
          />
        </div>
      </Section>

      <Section title="Trusted by Businesses Worldwide">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            title="— Sarah M., E-commerce Owner"
            description="Buizbot’s AI handles queries, and agents step in seamlessly—amazing support!"
            author
          />
          <FeatureCard
            title="— John D., Tech Startup CEO"
            description="Training with our data made the chatbot spot-on. Highly recommend!"
            author
          />
          <FeatureCard
            title="— Emily R., Marketing Manager"
            description="The analytics dashboard optimizes our support strategy perfectly."
            author
          />
        </div>
      </Section>

      <Section background className="text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-teal-400 mb-4">
          Ready to Revolutionize Your Support?
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6">
          Join thousands of businesses using Buizbot for intelligent, scalable support.
        </p>
        <Button href="/register" variant="primary">Get Started Now</Button>
      </Section>

      <Footer />
    </div>
  );
};

export default Landing;