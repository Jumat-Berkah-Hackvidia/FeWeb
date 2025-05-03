import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Upload,
  Download,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";

interface BriefFormData {
  email: string;
  campaign_name: string;
  product_name: string;
  platform: string[];
  category: string;
  price_range: string;
  campaign_period: string;
  current_description: string;
  current_goals: string;
  current_notes: string;
  product_image: File | null;
  pdf_file: File | null;
}

interface BriefResponse {
  "Campaign Description": string;
  "Campaign Goals": string;
  "Important Note": string;
  request_id: string;
  image_url?: string;
}

const CreateBrief: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBrief, setGeneratedBrief] = useState<BriefResponse | null>(
    null
  );

  const [formData, setFormData] = useState<BriefFormData>({
    email: user?.email || "",
    campaign_name: "",
    product_name: "",
    platform: [],
    category: "",
    price_range: "",
    campaign_period: "",
    current_description: "",
    current_goals: "",
    current_notes: "",
    product_image: null,
    pdf_file: null,
  });

  const [productImagePreview, setProductImagePreview] = useState<string | null>(
    null
  );
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlatformChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const platforms = checked
        ? [...prev.platform, value]
        : prev.platform.filter((p) => p !== value);
      return { ...prev, platform: platforms };
    });
  };

  const updateCampaignPeriod = useCallback((start: string, end: string) => {
    if (start && end) {
      const formattedStart = new Date(start).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      const formattedEnd = new Date(end).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      setFormData((prev) => ({
        ...prev,
        campaign_period: `${formattedStart} - ${formattedEnd}`,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        campaign_period: "",
      }));
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;

    if (!files || !files[0]) return;

    if (name === "product_image") {
      const file = files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      setFormData((prev) => ({ ...prev, product_image: file }));
      setProductImagePreview(URL.createObjectURL(file));
    } else if (name === "pdf_file") {
      const file = files[0];
      if (file.type !== "application/pdf") {
        toast.error("Please select a valid PDF file");
        return;
      }

      setFormData((prev) => ({ ...prev, pdf_file: file }));
      setPdfFileName(file.name);
    }
  };

  const goToNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const goToPrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const validateStep1 = () => {
    if (!formData.campaign_name || !formData.product_name) {
      toast.error("Please enter both campaign name and product name");
      return false;
    }
    return true;
  };

  const handleGenerateBrief = async () => {
    if (!formData.email) {
      toast.error("Email is required");
      return;
    }

    setIsGenerating(true);

    try {
      const data = new FormData();

      // Process platform array to comma-separated string
      const processedData = {
        ...formData,
        platform: formData.platform.join(", "),
      };

      // Append all form fields
      Object.entries(processedData).forEach(([key, value]) => {
        if (
          value !== null &&
          (typeof value === "string" ? value.trim() !== "" : true)
        ) {
          data.append(key, value);
        }
      });

      // Append files
      if (formData.product_image) {
        data.append("product_image", formData.product_image);
      }
      if (formData.pdf_file) {
        data.append("pdf_file", formData.pdf_file);
      }

      const response = await fetch(
        "https://hackvidia.riqgarden.pp.ua/generate-brief",
        {
          method: "POST",
          body: data,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate brief");
      }

      const result = await response.json();
      setGeneratedBrief(result);
      setCurrentStep(4);
      toast.success("Brief generated successfully!");
    } catch (error) {
      console.error("Error generating brief:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to generate brief"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!generatedBrief?.request_id) {
      toast.error("No brief data available for download");
      return;
    }

    window.open(
      `https://hackvidia.riqgarden.pp.ua/download-pdf/${generatedBrief.request_id}`,
      "_blank"
    );
  };

  const handleFindInfluencers = () => {
    if (generatedBrief) {
      sessionStorage.setItem(
        "lastGeneratedBrief",
        JSON.stringify(generatedBrief)
      );
      sessionStorage.setItem("briefCategory", formData.category);
      navigate("/influencers");
    }
  };

  return (
    <div className="page-container mt-20">
      <Button
        variant="outline"
        size="sm"
        className="mb-6"
        onClick={() => navigate("/dashboard")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>

      <h1 className="page-heading">Create Product Brief</h1>

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="w-full bg-gray-200 h-2 rounded-full mb-4">
            <div
              className="bg-brand-500 h-2 rounded-full transition-all"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>

          <div className="flex justify-between">
            <span
              className={
                currentStep >= 1
                  ? "font-medium text-brand-700"
                  : "text-gray-500"
              }
            >
              Campaign Info
            </span>
            <span
              className={
                currentStep >= 2
                  ? "font-medium text-brand-700"
                  : "text-gray-500"
              }
            >
              Product Details
            </span>
            <span
              className={
                currentStep >= 3
                  ? "font-medium text-brand-700"
                  : "text-gray-500"
              }
            >
              Brief Draft
            </span>
            <span
              className={
                currentStep >= 4
                  ? "font-medium text-brand-700"
                  : "text-gray-500"
              }
            >
              Generated Brief
            </span>
          </div>
        </div>

        <Card className="p-6">
          {currentStep === 1 && (
            <div className="space-y-6 form-step">
              <h2 className="text-2xl font-bold mb-6">Campaign Information</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="campaign_name">Campaign Name*</Label>
                  <Input
                    id="campaign_name"
                    name="campaign_name"
                    value={formData.campaign_name}
                    onChange={handleInputChange}
                    placeholder="Summer Collection Launch 2024"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="product_name">Product Name*</Label>
                  <Input
                    id="product_name"
                    name="product_name"
                    value={formData.product_name}
                    onChange={handleInputChange}
                    placeholder="EcoFriendly Water Bottle"
                    required
                  />
                </div>

                <div>
                  <Label>Platform(s)</Label>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {[
                      "TikTok",
                      "Instagram",
                      "Facebook",
                      "YouTube",
                      "Twitter",
                    ].map((platform) => (
                      <Label
                        key={platform}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          value={platform}
                          checked={formData.platform.includes(platform)}
                          onChange={handlePlatformChange}
                          className="h-4 w-4"
                        />
                        <span>{platform}</span>
                      </Label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        const newStart = e.target.value;
                        setStartDate(newStart);
                        updateCampaignPeriod(newStart, endDate);
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={endDate}
                      onChange={(e) => {
                        const newEnd = e.target.value;
                        setEndDate(newEnd);
                        updateCampaignPeriod(startDate, newEnd);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    if (validateStep1()) goToNextStep();
                  }}
                >
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6 form-step">
              <h2 className="text-2xl font-bold mb-6">Product Details</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="category">Product Category</Label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="Fashion, Electronics, Beauty, etc."
                  />
                </div>

                <div>
                  <Label htmlFor="price_range">Price Range (IDR)</Label>
                  <Input
                    id="price_range"
                    name="price_range"
                    value={formData.price_range}
                    onChange={handleInputChange}
                    placeholder="100,000 - 500,000"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="product_image">Product Image</Label>
                    <div className="mt-2">
                      <Input
                        id="product_image"
                        type="file"
                        name="product_image"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <Label
                        htmlFor="product_image"
                        className="cursor-pointer border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center"
                      >
                        {productImagePreview ? (
                          <img
                            src={productImagePreview}
                            alt="Product"
                            className="max-h-40 object-contain mb-2"
                          />
                        ) : (
                          <Upload className="h-10 w-10 text-gray-400 mb-2" />
                        )}
                        <span className="text-sm text-gray-600">
                          {productImagePreview
                            ? "Change image"
                            : "Upload product image"}
                        </span>
                      </Label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="pdf_file">Additional Document (PDF)</Label>
                    <div className="mt-2">
                      <Input
                        id="pdf_file"
                        type="file"
                        name="pdf_file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <Label
                        htmlFor="pdf_file"
                        className="cursor-pointer border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center"
                      >
                        <FileText className="h-10 w-10 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">
                          {pdfFileName || "Upload PDF document"}
                        </span>
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={goToPrevStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={goToNextStep}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6 form-step">
              <h2 className="text-2xl font-bold mb-6">Product Brief Draft</h2>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="current_description">
                    Campaign Description
                  </Label>
                  <Textarea
                    id="current_description"
                    name="current_description"
                    value={formData.current_description}
                    onChange={handleInputChange}
                    placeholder="Describe your campaign in detail..."
                    className="h-32"
                  />
                </div>

                <div>
                  <Label htmlFor="current_goals">Campaign Goals</Label>
                  <Textarea
                    id="current_goals"
                    name="current_goals"
                    value={formData.current_goals}
                    onChange={handleInputChange}
                    placeholder="What are the goals of this campaign?"
                    className="h-24"
                  />
                </div>

                <div>
                  <Label htmlFor="current_notes">Important Notes</Label>
                  <Textarea
                    id="current_notes"
                    name="current_notes"
                    value={formData.current_notes}
                    onChange={handleInputChange}
                    placeholder="Any additional notes or considerations..."
                    className="h-24"
                  />
                </div>
              </div>

              <Alert>
                <AlertDescription>
                  Our AI will enhance your draft with more details and
                  professional language. Leave fields blank if you want the AI
                  to generate content from scratch.
                </AlertDescription>
              </Alert>

              <div className="flex justify-between">
                <Button variant="outline" onClick={goToPrevStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button
                  onClick={handleGenerateBrief}
                  disabled={isGenerating}
                  className="gradient-bg hover:opacity-90"
                >
                  {isGenerating ? "Generating..." : "Generate Brief"}
                </Button>
              </div>
            </div>
          )}

          {currentStep === 4 && generatedBrief && (
            <div className="space-y-6 form-step">
              <h2 className="text-2xl font-bold mb-6">
                Generated Product Brief
              </h2>

              {generatedBrief.image_url && (
                <div className="mb-6">
                  <img
                    src={generatedBrief.image_url}
                    alt="Product"
                    className="max-h-60 object-contain mx-auto rounded-md border"
                  />
                </div>
              )}

              <Tabs defaultValue="description">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="goals">Goals</TabsTrigger>
                  <TabsTrigger value="notes">Important Notes</TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="space-y-4">
                  <h3 className="text-xl font-semibold">
                    Campaign Description
                  </h3>
                  <div className="p-4 bg-muted rounded-md whitespace-pre-wrap">
                    {generatedBrief["Campaign Description"]}
                  </div>
                </TabsContent>

                <TabsContent value="goals" className="space-y-4">
                  <h3 className="text-xl font-semibold">Campaign Goals</h3>
                  <div className="p-4 bg-muted rounded-md whitespace-pre-wrap">
                    {generatedBrief["Campaign Goals"]}
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="space-y-4">
                  <h3 className="text-xl font-semibold">Important Note</h3>
                  <div className="p-4 bg-muted rounded-md whitespace-pre-wrap">
                    {generatedBrief["Important Note"]}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={handleDownloadPdf}
                  className="flex-1"
                >
                  <Download className="mr-2 h-4 w-4" /> Download PDF
                </Button>
                <Button
                  onClick={handleFindInfluencers}
                  className="gradient-bg hover:opacity-90 flex-1"
                >
                  Find Influencers <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
export default CreateBrief;
