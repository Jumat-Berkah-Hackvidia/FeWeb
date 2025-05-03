import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ArtistBookingProps {
  artistName: string;
}

const ArtistBooking: React.FC<ArtistBookingProps> = ({ artistName }) => {
  const [form, setForm] = useState({
    campaignName: "",
    message: "",
    budget: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now just show a toast
    toast.success(`Booking request sent to ${artistName}`);
    setForm({ campaignName: "", message: "", budget: "" });
  };

  return (
    <Card className="mb-10">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="campaignName">Campaign Name</Label>
            <Input
              id="campaignName"
              name="campaignName"
              value={form.campaignName}
              onChange={handleChange}
              placeholder="e.g. Summer Product Launch"
              required
            />
          </div>

          <div>
            <Label htmlFor="budget">Estimated Budget</Label>
            <Input
              id="budget"
              name="budget"
              value={form.budget}
              onChange={handleChange}
              placeholder="e.g. $1000"
              required
            />
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Describe your campaign and what you'd like the influencer to do..."
              required
            />
          </div>

          <div>
            <Button type="submit" className="w-full">
              Send Booking Request
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ArtistBooking;
