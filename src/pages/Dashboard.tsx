import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { FileText, Plus, Search } from "lucide-react";

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="page-container pt-[144px]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome, {user?.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Create a Product Brief</CardTitle>
            <CardDescription>
              Generate an AI-powered product brief based on your campaign
              information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <FileText className="h-16 w-16 text-brand-400" />
            </div>
          </CardContent>
          <CardFooter>
            <Link to="/create-brief" className="w-full">
              <Button className="w-full">Get Started</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Find Influencers</CardTitle>
            <CardDescription>
              Find the perfect influencers for your product based on category
              and location
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <Search className="h-16 w-16 text-brand-400" />
            </div>
          </CardContent>
          <CardFooter>
            <Link to="/influencers" className="w-full">
              <Button className="w-full">Browse Influencers</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
