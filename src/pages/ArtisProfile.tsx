import React, { useState } from "react";

type Service = {
  key: string;
  label: string;
  price: number;
};

const services: Service[] = [
  { key: "igPost", label: "IG Post", price: 50000000 },
  { key: "igReels", label: "IG Reels", price: 65000000 },
  { key: "igStory", label: "IG Story", price: 25000000 },
  { key: "tiktokPost", label: "TikTok Post", price: 40000000 },
  { key: "tiktokStory", label: "TikTok Story", price: 20000000 },
  { key: "liveSession", label: "Live Session", price: 100000000 },
];

const formatRupiah = (num: number) =>
  "Rp " + num.toLocaleString("id-ID", { minimumFractionDigits: 0 });

const SelectedServicesList: React.FC<{ selectedServices: string[] }> = ({
  selectedServices,
}) => {
  return (
    <ul className="list-disc pl-5 space-y-2">
      {selectedServices.length > 0 ? (
        selectedServices.map((key) => {
          const item = services.find((s) => s.key === key);
          return (
            <li key={key}>
              {item?.label} - {formatRupiah(item?.price || 0)}
            </li>
          );
        })
      ) : (
        <li>Tidak ada layanan yang dipilih</li>
      )}
    </ul>
  );
};

const ArtistBooking: React.FC = () => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const toggleService = (key: string) => {
    setSelectedServices((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const total = services
    .filter((s) => selectedServices.includes(s.key))
    .reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-md text-gray-800 space-y-4">
      <h2 className="text-2xl font-bold">Booking Layanan untuk Agnez Mo</h2>

      <div className="space-y-2">
        {services.map((service) => (
          <label key={service.key} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={service.key}
              checked={selectedServices.includes(service.key)}
              onChange={() => toggleService(service.key)}
              className="rounded"
            />
            <span>
              {service.label} ({formatRupiah(service.price)})
            </span>
          </label>
        ))}
      </div>

      <div className="pt-4 border-t">
        <h3 className="font-semibold">Layanan Dipilih:</h3>
        <SelectedServicesList selectedServices={selectedServices} />

        <div className="mt-4 text-lg font-bold">
          Total: {formatRupiah(total)}
        </div>
      </div>
    </div>
  );
};

export default ArtistBooking;
