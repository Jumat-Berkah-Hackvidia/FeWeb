import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react"; // You can use any star icon or component
import { toast } from "sonner";

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract payment data from state
  const { state } = location;
  const { totalPrice, items, paymentMethod, bank, timestamp } = state || {};

  // Rating state
  const [rating, setRating] = useState<number>(0);
  const [description, setDescription] = useState<string>("");

  // Handle rating change
  const handleRatingChange = (rate: number) => {
    setRating(rate);
  };

  // Handle description change
  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value);
  };

  // Handle submit (you can integrate it with an API to save the rating/feedback)
  const handleSubmitRating = () => {
    if (rating === 0) {
      toast.error("Please provide a rating");
      return;
    }
    // Simulate submitting the rating and feedback
    toast.success("Thank you for your feedback!");
    // Optionally, you can reset the form or navigate
    setRating(0);
    setDescription("");
  };

  // Render the payment success page
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 mt-20">
      <h1 className="text-2xl font-bold">Payment Success</h1>

      {/* Payment Summary */}
      <Card className="bg-muted">
        <CardContent className="p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Amount:</span>
            <span className="text-xl font-bold text-primary">
              IDR {totalPrice.toLocaleString("id-ID")}
            </span>
          </div>

          <div className="border-t pt-3">
            <h3 className="font-medium mb-2">Order Details:</h3>
            <ul className="space-y-1">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span>{item.title}</span>
                  <span>IDR {item.price.toLocaleString("id-ID")}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t pt-3">
            <h3 className="font-medium mb-2">Payment Method:</h3>
            <p>{paymentMethod}</p>
            {bank && <p>Bank: {bank}</p>}
            <p>Timestamp: {new Date(timestamp).toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>

      {/* Rating Section */}
      <div className="space-y-6 mt-6">
        <h2 className="text-xl font-medium">Rate Your Purchase</h2>

        {/* Star Rating */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRatingChange(star)}
              className={`p-2 ${
                rating >= star ? "text-yellow-500" : "text-gray-300"
              }`}
            >
              <Star className="h-6 w-6" />
            </button>
          ))}
        </div>

        {/* Rating Description */}
        <div>
          <label htmlFor="description" className="block font-medium">
            Your Feedback
          </label>
          <textarea
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            rows={4}
            className="w-full p-2 mt-2 border rounded-md"
            placeholder="Tell us about your experience..."
          />
        </div>

        {/* Submit Button */}
        <Button onClick={handleSubmitRating} className="w-full" size="lg">
          Submit Feedback
        </Button>
      </div>

      {/* Back to Home or Other Button */}
      <Button
        onClick={() => navigate("/")}
        variant="outline"
        className="w-full mt-6"
        size="lg"
      >
        Back to Home
      </Button>
    </div>
  );
};

export default PaymentSuccess;
