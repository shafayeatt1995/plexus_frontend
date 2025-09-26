"use client";
import { getItem, initLottie, removeItem } from "@/utils";
import { signIn } from "next-auth/react";
import React, { useEffect, useRef, useCallback } from "react";

export default function SocialLogin() {
  const loadingRef = useRef(null);

  const getDetails = useCallback(async () => {
    const socialLogin = getItem("socialLogin");
    try {
      const query = Object.fromEntries(
        new URLSearchParams(window.location.search)
      );
      if (socialLogin) removeItem("socialLogin");
      const { c, e } = query;
      if (e) {
        window.open(socialLogin || location.origin, "_self");
      } else if (c) {
        const { email, id, provider } = JSON.parse(atob(c));

        await signIn("credentials", {
          email,
          id,
          provider,
          password: "password",
          redirect: false,
        });
        window.open(socialLogin || "/", "_self");
      } else {
        window.open(socialLogin || location.origin, "_self");
      }
    } catch (error) {
      console.error(error);
      window.open(socialLogin || location.origin, "_self");
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      if (loadingRef.current) {
        await initLottie(loadingRef.current, "/lottie/social-login.json");
      }
      await getDetails();
    };
    init();

    return () => {
      if (window.lottie) {
        window.lottie.stop();
        window.lottie.destroy();
      }
    };
  }, [getDetails]);

  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen">
      <div ref={loadingRef} className="max-h-80"></div>
      <div className="flex justify-center">
        <p className="text-gray-700">We are verifying your information</p>
      </div>
    </div>
  );
}
