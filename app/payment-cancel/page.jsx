"use client";

import { useRef, useState, useEffect } from "react";
import { refreshToken } from "../../services/nextAuth";
import { initLottie } from "../../utils";
import { useRouter } from "next/navigation";

export default function PaymentSuccess() {
  const router = useRouter();
  const loadingRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const init = async () => {
    try {
      if (loadingRef.current) {
        await initLottie(loadingRef.current, "/lottie/payment-cancel.json");
      }
      setTimeout(() => {
        setLoading(true);
      }, 500);
      setTimeout(async () => {
        router.push("/");
      }, 5000);
    } catch (error) {
    } finally {
      this.click = true;
    }
  };

  useEffect(() => {
    init();

    return () => {
      if (window.lottie) {
        window.lottie.stop();
        window.lottie.destroy();
      }
    };
  }, []);

  return (
    <div className="flex flex-col justify-center items-center py-20 h-screen">
      <div ref={loadingRef} className="max-h-72"></div>
      <div className="flex justify-center flex-col items-center gap-2">
        <div className="w-full h-1 bg-gray-200 rounded-full">
          <div
            className={`h-1 bg-green-600 rounded-full transition-all duration-5000 ${
              loading ? "w-full" : "w-[0%]"
            }`}
          ></div>
        </div>
        <p className="text-gray-700">Payment failed. Please try again.</p>
      </div>
    </div>
  );
}
