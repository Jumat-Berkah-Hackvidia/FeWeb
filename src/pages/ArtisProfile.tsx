import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

interface ServiceOption {
  id: string;
  title: string;
  price: number;
  platform: "Instagram" | "TikTok";
}

const services: ServiceOption[] = [
  {
    id: "ig-reels",
    title: "Instagram Reels",
    price: 3000000,
    platform: "Instagram",
  },
  {
    id: "ig-post",
    title: "Instagram Post (Gambar)",
    price: 2500000,
    platform: "Instagram",
  },
  {
    id: "ig-story",
    title: "Instagram Story",
    price: 1200000,
    platform: "Instagram",
  },
  { id: "tt-video", title: "TikTok Video", price: 3500000, platform: "TikTok" },
  {
    id: "tt-post",
    title: "TikTok Post (Gambar)",
    price: 2000000,
    platform: "TikTok",
  },
  { id: "tt-story", title: "TikTok Story", price: 1000000, platform: "TikTok" },
];

const formatCurrency = (num: number) => "Rp " + num.toLocaleString("id-ID");

const ArtisProfile: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedItems = services.filter((item) => selected.includes(item.id));
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="max-w-5xl mx-auto p-6 mt-20">
      {/* Back button */}
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Kembali
      </Button>

      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
        <img
          src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=300&q=80"
          alt="Sarah Johnson"
          className="w-44 h-44 object-cover rounded-full border shadow"
        />
        <div>
          <h1 className="text-3xl font-bold">Sarah Johnson</h1>
          <p className="text-muted-foreground">@sarahjstyle</p>
          <div className="mt-3 text-sm space-y-1">
            <p>
              <strong>Instagram:</strong> 125K followers
            </p>
            <p>
              <strong>TikTok:</strong> 80K followers
            </p>
            <p>
              <strong>YouTube:</strong> 45K subscribers
            </p>
          </div>
        </div>
      </div>

      {/* Services */}
      <h2 className="text-2xl font-semibold mb-4">Pilih Layanan</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {services.map((item) => (
          <Card
            key={item.id}
            className={clsx(
              "cursor-pointer border-2 transition-all",
              selected.includes(item.id)
                ? "border-blue-500 bg-blue-50"
                : "hover:border-gray-300"
            )}
            onClick={() => toggleSelect(item.id)}
          >
            <CardContent className="p-4 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{item.title}</h3>
                {selected.includes(item.id) && (
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                )}
              </div>
              <p className="text-muted-foreground text-sm">
                {formatCurrency(item.price)}
              </p>
              <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                {item.platform}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      {selected.length > 0 && (
        <div className="border-t pt-6">
          <h3 className="text-xl font-semibold mb-2">Ringkasan Pilihan:</h3>
          <ul className="list-disc pl-5 mb-3 text-sm">
            {selectedItems.map((item) => (
              <li key={item.id}>
                {item.title} - {formatCurrency(item.price)}
              </li>
            ))}
          </ul>
          <p className="text-lg font-bold">
            Total Harga: {formatCurrency(totalPrice)}
          </p>
          <Button
            className="mt-4"
            onClick={() =>
              navigate("/agreement", { state: { totalPrice, selectedItems } })
            }
          >
            Ajukan Kerjasama
          </Button>
        </div>
      )}
    </div>
  );
};

export default ArtisProfile;
