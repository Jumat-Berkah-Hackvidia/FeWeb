import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AIDorseLogo from "@/assets/AIDorseLogo.png";
import { useAuth } from "@/contexts/AuthContext";
import {
  MdSmartToy,
  MdAnalytics,
  MdImage,
  MdPersonSearch,
  MdPictureAsPdf,
} from "react-icons/md";

const About: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="page-container bg-gray-50">
      {/* Header dengan gambar dan branding */}
      <header className="relative bg-brand-800 text-white py-20 mt-24 rounded-[32px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/path/to/your/image.jpg')" }}
        ></div>
        <div className="relative z-10 text-center">
          <img src={AIDorseLogo} alt="AIDorse Logo" className="w-24" />
          <h1 className="text-4xl font-extrabold">AIDORSE</h1>
          <p className="mt-4 text-lg">
            Revolutionizing Product Brief Creation with AI
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-8">
        {/* Our Mission Section */}
        <section className="mb-12">
          <h2 className="section-heading text-center">Our Mission</h2>
          <p className="text-lg text-gray-700 mb-6">
            At AIDORSE AI, we're revolutionizing how product briefs are created.
            Our AI-powered platform helps marketers and product teams generate
            comprehensive, professional product briefs in minutes, not hours or
            days.
          </p>
          <p className="text-lg text-gray-700">
            We believe that every great product deserves a great brief. Our
            technology combines your product knowledge with advanced AI to
            create briefs that communicate your vision clearly and effectively.
          </p>
        </section>

        {/* Key Features Section */}
        <section className="mb-12">
          <h2 className="section-heading text-center">Key Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <div className="text-brand-700 text-4xl mb-4 flex justify-center">
                <MdSmartToy />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-brand-700">
                AI-Enhanced Content
              </h3>
              <p>
                Transform basic information into comprehensive campaign
                descriptions, goals, and notes.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <div className="text-brand-700 text-4xl mb-4 flex justify-center">
                <MdAnalytics />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-brand-700">
                Document Analysis
              </h3>
              <p>
                Upload existing PDFs to provide context and improve AI
                understanding of your product.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <div className="text-brand-700 text-4xl mb-4 flex justify-center">
                <MdImage />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-brand-700">
                Image Integration
              </h3>
              <p>
                Include product images to enhance your brief and make it
                visually compelling.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <div className="text-brand-700 text-4xl mb-4 flex justify-center">
                <MdPersonSearch />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-brand-700">
                Influencer Matching
              </h3>
              <p>
                Find relevant influencers based on your product category and
                target location.
              </p>
            </div>
          </div>

          <div className="bg-brand-100 p-6 rounded-lg flex items-start gap-4">
            <div className="text-brand-800 text-3xl mt-1">
              <MdPictureAsPdf />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-brand-800">
                Professional PDF Export
              </h3>
              <p>
                Download your complete product brief as a beautifully formatted
                PDF ready to share with your team.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="mb-12">
          <h2 className="section-heading text-center">How It Works</h2>
          <ol className="list-decimal pl-6 space-y-4 text-lg text-gray-700">
            <li>
              <strong>Enter campaign information</strong> - Provide basic
              details about your product and campaign.
            </li>
            <li>
              <strong>Upload supporting materials</strong> - Add product images
              and relevant documents to enhance AI understanding.
            </li>
            <li>
              <strong>Generate brief content</strong> - Our AI creates
              comprehensive campaign descriptions, goals, and important notes.
            </li>
            <li>
              <strong>Find influencers</strong> - Match your product with
              relevant influencers based on category and location.
            </li>
            <li>
              <strong>Download and share</strong> - Export your professional
              brief as a PDF and share it with stakeholders.
            </li>
          </ol>
        </section>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold mb-4">
            Ready to create your first AI-powered product brief?
          </h2>
          <Link to={user ? "/dashboard" : "/login"}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-brand-500 to-brand-700 text-white hover:opacity-90 transition-all duration-300"
            >
              Get Started Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
