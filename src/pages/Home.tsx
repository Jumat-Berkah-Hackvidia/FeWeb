import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, FileText, Upload, Search } from "lucide-react";

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen pt-[60px]">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#3E54AC] to-[#5C73DF] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Transform Your Product Strategy
          </h1>
          <p className="text-lg md:text-2xl max-w-2xl mx-auto opacity-90 mb-8">
            Generate professional product briefs with AI in minutes, not hours
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to={user ? "/dashboard" : "/login"}>
              <Button
                size="lg"
                className="bg-white text-[#3E54AC] hover:bg-gray-100 transition"
              >
                Start Creating <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/about">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-[#3E54AC] hover:bg-white hover:text-[#3E54AC] transition"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#3E54AC] mb-12">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Upload className="h-8 w-8 text-[#3E54AC]" />,
                title: "1. Upload Information",
                desc: "Provide basic campaign information and upload relevant images or documents",
              },
              {
                icon: <FileText className="h-8 w-8 text-[#3E54AC]" />,
                title: "2. Generate Brief",
                desc: "Our AI enhances your information into a comprehensive product brief",
              },
              {
                icon: <Search className="h-8 w-8 text-[#3E54AC]" />,
                title: "3. Find Influencers",
                desc: "Match your product with relevant influencers based on category and location",
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="bg-[#f0f4ff] p-6 rounded-xl shadow-sm hover:shadow-md transition text-center"
              >
                <div className="w-16 h-16 bg-[#e0e7ff] rounded-full flex items-center justify-center mx-auto mb-4">
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold text-[#2d3a86] mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
    </div>
  );
};

export default Home;
