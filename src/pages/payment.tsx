import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

// 1. Define TypeScript interfaces
interface OrderItem {
  id: string | number;
  title: string;
  price: number;
  quantity?: number;
}

interface PaymentMethod {
  id: string;
  name: string;
  banks?: string[];
  wallets?: string[];
  icon: string;
  image?: string;
  bankDetails?: Record<string, { accountNumber: string }>;
}

interface PaymentState {
  totalPrice: number;
  selectedItems: OrderItem[];
}

// 2. Payment method data with type
const paymentMethods: PaymentMethod[] = [
  {
    id: "VA",
    name: "Virtual Account",
    banks: ["BCA", "Mandiri", "BNI", "BRI"],
    icon: "🏦",
    bankDetails: {
      BCA: { accountNumber: "123-456-7890" },
      Mandiri: { accountNumber: "098-765-4321" },
      BNI: { accountNumber: "112-233-4455" },
      BRI: { accountNumber: "667-788-9900" },
    },
  },
  {
    id: "QRIS",
    name: "QRIS",
    icon: "📱",
    image: "/image.png", // Add your QRIS image path here
  },
  {
    id: "E-Wallet",
    name: "E-Wallet",
    wallets: ["Gopay", "OVO", "Dana", "ShopeePay"],
    icon: "💳",
  },
];

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bankDetails, setBankDetails] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const isPaymentState = (state: unknown): state is PaymentState => {
    return (
      !!state &&
      typeof (state as PaymentState).totalPrice === "number" &&
      Array.isArray((state as PaymentState).selectedItems)
    );
  };

  const { state } = location;
  if (!isPaymentState(state)) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      toast.error("Invalid payment data");
      navigate("/");
    }, [navigate]);

    return null;
  }

  const { totalPrice, selectedItems } = state;

  // Handle bank selection and show bank details
  const handleBankClick = (bank: string) => {
    setSelectedBank(bank);
    const bankInfo = paymentMethods.find(
      (method) => method.id === "VA"
    )?.bankDetails;
    if (bankInfo && bankInfo[bank]) {
      setBankDetails(`Account Number: ${bankInfo[bank]?.accountNumber}`);
    }
  };

  // Handle payment confirmation with a 10-second delay
  const handlePayment = async (): Promise<void> => {
    if (!paymentMethod) {
      toast.error("Please select payment method");
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing with a 10-second delay
      await new Promise((resolve) => setTimeout(resolve, 10000)); // 10 seconds delay

      setShowSuccessModal(true); // Show success notification

      // Redirect to the payment success page after 10 seconds
      setTimeout(() => {
        navigate("/paymentsucces", {
          state: {
            totalPrice,
            items: selectedItems,
            paymentMethod,
            bank: selectedBank,
            timestamp: new Date().toISOString(),
          },
        });
      }, 3000); // Wait 3 seconds before navigating to the success page
    } catch (error) {
      toast.error("Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 mt-20">
      <h1 className="text-2xl font-bold">Payment Process</h1>

      {/* Order Summary */}
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
              {selectedItems.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span>{item.title}</span>
                  <span>IDR {item.price.toLocaleString("id-ID")}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <div className="space-y-6">
        <h2 className="text-xl font-medium">Select Payment Method</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map((method) => (
            <Card
              key={method.id}
              onClick={() => setPaymentMethod(method.id)}
              className={`cursor-pointer transition-all ${
                paymentMethod === method.id
                  ? "border-primary bg-primary/10"
                  : "hover:border-muted-foreground"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{method.icon}</span>
                  <div>
                    <h3 className="font-medium">{method.name}</h3>

                    {/* Bank Selection */}
                    {method.banks && (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {method.banks.map((bank) => (
                          <Button
                            key={bank}
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBankClick(bank);
                            }}
                            className={
                              selectedBank === bank ? "bg-primary/10" : ""
                            }
                          >
                            {bank}
                          </Button>
                        ))}
                      </div>
                    )}

                    {/* QR Code Display */}
                    {method.image && paymentMethod === method.id && (
                      <div className="mt-4 p-2 bg-white rounded-lg">
                        <img
                          src={method.image}
                          alt="Payment QR Code"
                          className="w-48 h-48 mx-auto"
                        />
                        <p className="text-center text-sm mt-2 text-muted-foreground">
                          Scan QR code using your payment app
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bank Account Information */}
        {selectedBank && bankDetails && (
          <div className="mt-4 p-4 border bg-white rounded-lg">
            <p className="font-medium text-lg">{selectedBank}</p>
            <p className="text-sm text-muted-foreground">{bankDetails}</p>
          </div>
        )}

        {/* Payment Button */}
        <Button
          onClick={handlePayment}
          disabled={!paymentMethod || isProcessing}
          className="w-full"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Confirm Payment"
          )}
        </Button>

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-lg text-center">
              <h2 className="text-lg font-bold">Payment Success!</h2>
              <p className="mt-2">
                Your payment has been processed successfully.
              </p>
              <Button
                className="mt-4"
                onClick={() => setShowSuccessModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
