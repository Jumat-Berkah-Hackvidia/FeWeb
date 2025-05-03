import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link from react-router-dom
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Filter } from "lucide-react";
import CategorySelector, { Category } from "@/components/CategorySelector";
import { toast } from "sonner";

interface Influencer {
  id: string;
  name: string;
  username: string;
  category: string;
  location: string;
  followers: string;
  engagement: string;
  imageUrl: string;
}

// Mock data for influencers
const mockInfluencers: Influencer[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    username: "@sarahjstyle",
    category: "Fashion",
    location: "Jakarta",
    followers: "125K",
    engagement: "3.8%",
    imageUrl:
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "2",
    name: "Michael Wong",
    username: "@mikewtech",
    category: "Technology",
    location: "Bandung",
    followers: "78K",
    engagement: "4.2%",
    imageUrl:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=300&q=80",
  },
  // More mock influencers...
];

const locations = [
  "All Locations",
  "Jakarta",
  "Bandung",
  "Surabaya",
  "Yogyakarta",
  "Bali",
];

// Convert categories to the format expected by CategorySelector
const categoryOptions: Category[] = [
  { value: "All Categories", label: "All Categories" },
  { value: "Fashion", label: "Fashion" },
  { value: "Technology", label: "Technology" },
  { value: "Beauty", label: "Beauty" },
  { value: "Food", label: "Food" },
  { value: "Lifestyle", label: "Lifestyle" },
  { value: "Travel", label: "Travel" },
];

const Influencers: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredInfluencers, setFilteredInfluencers] =
    useState<Influencer[]>(mockInfluencers);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [briefDetails, setBriefDetails] = useState<{
    category: string;
    name: string;
  } | null>(null);

  // Check if we have a stored brief category and show a toast notification
  useEffect(() => {
    const briefCategory = sessionStorage.getItem("briefCategory");
    const briefData = sessionStorage.getItem("lastGeneratedBrief");
    let briefName = "";

    if (briefData) {
      try {
        const parsedBrief = JSON.parse(briefData);
        if (parsedBrief) {
          briefName = parsedBrief.campaign_name || "";
        }
      } catch (e) {
        console.error("Error parsing brief data", e);
      }
    }

    if (briefCategory) {
      // Map brief category to influencer category if needed
      const mappedCategory = categoryOptions.find(
        (c) =>
          c.value.toLowerCase().includes(briefCategory.toLowerCase()) ||
          briefCategory.toLowerCase().includes(c.value.toLowerCase())
      );

      if (mappedCategory && mappedCategory.value !== "All Categories") {
        setSelectedCategory(mappedCategory.value);
        setBriefDetails({
          category: mappedCategory.value,
          name: briefName,
        });

        toast.success(
          `Showing ${mappedCategory.value} influencers for your brief`
        );
      }
    }
  }, []);

  // Filter influencers based on selected filters
  useEffect(() => {
    let filtered = [...mockInfluencers];

    if (selectedLocation !== "All Locations") {
      filtered = filtered.filter((inf) => inf.location === selectedLocation);
    }

    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter((inf) => inf.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (inf) =>
          inf.name.toLowerCase().includes(query) ||
          inf.username.toLowerCase().includes(query) ||
          inf.category.toLowerCase().includes(query)
      );
    }

    setFilteredInfluencers(filtered);
  }, [selectedLocation, selectedCategory, searchQuery]);

  const handleContactInfluencer = (influencer: Influencer) => {
    alert(`Contact feature for ${influencer.name} would be implemented here.`);
  };

  const toggleFilterVisibility = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  return (
    <div className="page-container">
      <Button
        variant="outline"
        size="sm"
        className="mb-6"
        onClick={() => navigate("/dashboard")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>

      <h1 className="page-heading">Find Influencers</h1>

      {briefDetails && (
        <div className="max-w-4xl mx-auto mb-6">
          <Card className="bg-brand-50 border-brand-200">
            <CardContent className="p-4">
              <p className="text-sm text-brand-700">
                Showing influencers based on your product brief:
                <span className="font-semibold ml-1">
                  {briefDetails.category}
                </span>
                {briefDetails.name && (
                  <span className="ml-1">for "{briefDetails.name}"</span>
                )}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recommended Influencers</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFilterVisibility}
              className="flex items-center gap-1"
            >
              <Filter className="h-4 w-4" />
              {isFilterVisible ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>

          <CategorySelector
            categories={categoryOptions}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {isFilterVisible && (
          <Card className="p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="location">Location</Label>
                <Select
                  value={selectedLocation}
                  onValueChange={setSelectedLocation}
                >
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search influencers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredInfluencers.length > 0 ? (
            filteredInfluencers.map((influencer) => (
              <Card key={influencer.id} className="overflow-hidden">
                <div className="flex">
                  <div className="w-1/3">
                    <img
                      src={influencer.imageUrl}
                      alt={influencer.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4 w-2/3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">
                          <Link
                            to={`/artisprofile/${influencer.id}`} // Link to the influencer's profile page
                            className="text-brand-600 hover:underline"
                          >
                            {influencer.name}
                          </Link>
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {influencer.username}
                        </p>
                      </div>
                      <span className="bg-brand-100 text-brand-800 text-xs px-2 py-1 rounded-full">
                        {influencer.category}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Location:</span>
                        <span className="font-medium ml-1">
                          {influencer.location}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Followers:
                        </span>
                        <span className="font-medium ml-1">
                          {influencer.followers}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Engagement:
                        </span>
                        <span className="font-medium ml-1">
                          {influencer.engagement}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleContactInfluencer(influencer)}
                        className="w-full"
                      >
                        Contact
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-2 text-center py-12">
              <p className="text-xl text-muted-foreground">
                No influencers found matching your criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Influencers;
