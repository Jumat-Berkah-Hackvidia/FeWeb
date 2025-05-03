/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Agreement: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalPrice, selectedItems } = location.state || {};
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleDownloadTemplate = () => {
    const url = "/files/agreement-template.pdf"; // Pastikan file ada di /public/files/
    const link = document.createElement("a");
    link.href = url;
    link.download = "Agreement-Template.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setUploadedFile(file);
  };

  const handleSubmit = () => {
    if (!uploadedFile) {
      toast.error("Silakan upload file Agreement terlebih dahulu.");
      return;
    }

    toast.success("Agreement berhasil dikirim!");

    // Simulasi pengiriman, lalu redirect ke pembayaran
    setTimeout(() => {
      navigate("/payment", {
        state: {
          totalPrice,
          selectedItems,
        },
      });
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-20">
      <h1 className="text-2xl font-bold mb-6">Agreement Kerjasama</h1>

      <Card className="mb-6">
        <CardContent className="p-4 space-y-2">
          <p className="text-sm">Total Harga:</p>
          <p className="text-xl font-semibold text-brand-600">
            Rp {totalPrice?.toLocaleString("id-ID")}
          </p>
          <ul className="text-sm list-disc pl-5">
            {selectedItems?.map((item: any) => (
              <li key={item.id}>{item.title}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="mb-6">
        <h2 className="font-semibold mb-2">1. Download Template Agreement</h2>
        <Button onClick={handleDownloadTemplate}>Download Template</Button>
      </div>

      <div className="mb-6">
        <h2 className="font-semibold mb-2">
          2. Upload Agreement yang Telah Diisi
        </h2>
        <Input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!uploadedFile}
        className="w-full mt-4"
      >
        Kirim Agreement
      </Button>
    </div>
  );
};

export default Agreement;
