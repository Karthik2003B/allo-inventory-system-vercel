"use client";

import { useEffect, useState } from "react";


export default function CountdownTimer({
  expiresAt,
}: {
  expiresAt: string;
}) {

  const calculateTimeLeft = () => {

    const difference =
      new Date(expiresAt).getTime() -
      new Date().getTime();

    if (difference <= 0) {
      return "Expired";
    }

    const minutes =
      Math.floor(difference / 1000 / 60);

    const seconds =
      Math.floor(
        (difference / 1000) % 60
      );

    return `${minutes}:${
      seconds < 10
        ? "0" + seconds
        : seconds
    }`;
  };

  const [timeLeft, setTimeLeft] =
    useState(calculateTimeLeft());

  useEffect(() => {

    const timer = setInterval(() => {
      setTimeLeft(
        calculateTimeLeft()
      );
    }, 1000);

    return () =>
      clearInterval(timer);

  }, []);

  return (
    <div className="text-xl font-bold">

      {timeLeft === "Expired" ? (

        <span className="text-red-500">
          Reservation Expired
        </span>

      ) : (

        <span>
          {timeLeft}
        </span>

      )}

    </div>
  );
}