"use client";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight, Zap, Target, BarChart, Clock, Star } from "lucide-react";

const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-bl from-indigo-600 via-purple-600 to-blue-500 text-white overflow-hidden">
      <div
        style={{
          transform: "scale(1)",
          transformOrigin: "top center",
          minHeight: "100vh",
        }}
      >
        {/* Header */}
        <header className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src="/crown.png" alt="WinWise AI Logo" className="w-10 h-10" />
            <div className="text-3xl font-extrabold tracking-tight">
              WinWise AI
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="container mx-auto px-4 pt-20 pb-32 relative">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
            >
              Win More Deals with{" "}
              <span className="text-yellow-300">AI-Powered Proposals</span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl mb-10 text-indigo-100"
            >
              Create tailored proposals in minutes, optimized for success using
              cutting-edge AI technology
            </motion.p>
            <motion.div variants={itemVariants}>
              <Link
                to="/generate"
                className="inline-flex items-center bg-yellow-400 text-indigo-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-yellow-300 transition-all duration-300 shadow-lg"
              >
                Try It Now <ChevronRight className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Features Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <FeatureCard
              icon={<Zap className="w-10 h-10 text-yellow-300" />}
              title="Lightning-Fast Generation"
              description="Create proposals in minutes"
            />
            <FeatureCard
              icon={<Target className="w-10 h-10 text-yellow-300" />}
              title="Success Optimization"
              description="AI boosts close rates"
            />
            <FeatureCard
              icon={<BarChart className="w-10 h-10 text-yellow-300" />}
              title="Smart Insights"
              description="Perfect your pitch"
            />
            <FeatureCard
              icon={<Clock className="w-10 h-10 text-yellow-300" />}
              title="Time Savings"
              description="Focus on selling"
            />
          </motion.div>

          {/* Testimonials Section */}
          {/* <motion.section
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-24"
          >
            <h2 className="text-4xl font-bold text-center mb-12">
              What Our Users Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <TestimonialCard
                name="Sarah J."
                role="Sales Manager"
                text="WinWise AI cut our proposal time in half and increased our win rate by 30%!"
              />
              <TestimonialCard
                name="Mike R."
                role="CEO"
                text="The AI suggestions are spot-on, making every proposal a winner."
              />
              <TestimonialCard
                name="Emily T."
                role="Business Dev"
                text="I love how easy it is to generate and download professional proposals."
              />
            </div>
          </motion.section> */}
        </main>

        {/* Professional Footer */}
        <footer className="bg-slate-800 shadow-2xl bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-xl p-6 text-center border-opacity-20py-12">
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
                <img
                  src="/crown.png"
                  alt="WinWise AI Logo"
                  className="w-8 h-8"
                />
                <h3 className="text-xl font-bold">WinWise AI</h3>
              </div>
              <p className="text-indigo-200">
                Empowering sales with AI-driven proposals
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-indigo-200">
                <li>
                  <a
                    href="#features"
                    className="hover:text-yellow-300 transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    className="hover:text-yellow-300 transition-colors"
                  >
                    Testimonials
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="hover:text-yellow-300 transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <p className="text-indigo-200">Email: support@winwise.ai</p>
              <p className="text-indigo-200">Phone: +1 (555) 123-4567</p>
              <p className="text-indigo-200">
                Address: 123 AI Street, Tech City
              </p>
            </div>
          </div>
          <div className="mt-8 text-center text-indigo-300">
            <p>© 2025 WinWise AI. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 text-center border border-indigo-400 border-opacity-20"
  >
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
    <p className="text-indigo-100">{description}</p>
  </motion.div>
);

const TestimonialCard = ({ name, role, text }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white bg-opacity-20 rounded-lg p-6 shadow-lg"
  >
    <div className="flex justify-center mb-4">
      <Star className="w-6 h-6 text-yellow-300 fill-current" />
      <Star className="w-6 h-6 text-yellow-300 fill-current" />
      <Star className="w-6 h-6 text-yellow-300 fill-current" />
      <Star className="w-6 h-6 text-yellow-300 fill-current" />
      <Star className="w-6 h-6 text-yellow-300 fill-current" />
    </div>
    <p className="text-indigo-100 mb-4">"{text}"</p>
    <p className="font-semibold">{name}</p>
    <p className="text-sm text-indigo-200">{role}</p>
  </motion.div>
);

export default LandingPage;
