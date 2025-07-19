import React, { useState, useEffect } from "react";

const Greetings = () => {
  const [dateTime, setDateTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${months[date.getMonth()]} ${String(date.getDate()).padStart(
      2,
      "0"
    )}, ${date.getFullYear()}`;
  };
  const formatTime = (date) => {
    return `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
  };

  return (
    <div className="flex justify-between px-8 mt-4">
      <div>
        <h1 className="text-white text-2xl font-semibold tracking-wide">
          Good Morning
        </h1>
        <p className="text-white font-sm">Give your best to customers</p>
      </div>

      <div>
        <h1 className="text-white text-4xl font-bold tracking-wide">
          {formatTime(dateTime)}
        </h1>
        <p className="text-white font-sm">{formatDate(dateTime)}</p>
      </div>
    </div>
  );
};

export default Greetings;
