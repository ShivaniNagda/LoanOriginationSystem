import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      

      {/* Hero Section */}
      <section
        className="flex-1 bg-cover bg-center flex items-center justify-center text-white text-center px-4"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1605902711622-cfb43c44367e)",
        }}
      >
        <div className="bg-sky-50 mt-20 text-sky-900 bg-opacity-50 p-10 rounded-2xl shadow-lg max-w-2xl">
          <h2 className="text-4xl font-bold mb-4">Fast, Secure & Smart Loan Management</h2>
          <p className="text-lg mb-6">
            Apply for loans, track applications, and manage everything online.
          </p>
          <Link
            to="/register"
            className="bg-white text-sky-900 font-semibold py-3 px-6 rounded-xl shadow-md hover:bg-gray-200 transition"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 ">
        <div className="container mx-auto text-center px-4">
          <h3 className="text-3xl text-gray-50 font-bold mb-10">Why Choose Us?</h3>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:-translate-y-2 transition">
              <h4 className="text-xl font-semibold mb-3">Easy Applications</h4>
              <p className="text-gray-600">
                Apply for loans in minutes with a smooth and simple process.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:-translate-y-2 transition">
              <h4 className="text-xl font-semibold mb-3">Instant Eligibility Check</h4>
              <p className="text-gray-600">
                Get real-time scoring with our intelligent evaluation system.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:-translate-y-2 transition">
              <h4 className="text-xl font-semibold mb-3">Officer Review</h4>
              <p className="text-gray-600">
                Your application is reviewed by verified loan officers.
              </p>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
}