import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../../https/index";

const Metrics = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  if (isLoading) {
    return <div className="text-white p-6">Loading orders...</div>;
  }

  if (isError) {
    return (
      <div className="text-red-500 p-6">
        Error loading orders: {error?.message || "Unknown error"}
      </div>
    );
  }

  const orders = data?.data?.data || [];

  // 1. DERIVED: Average Order Value (total revenue / number of orders)
  const totalRevenue = orders.reduce(
    (acc, order) => acc + order.bills.totalWithTax,
    0
  );
  const averageOrderValue =
    orders.length > 0 ? totalRevenue / orders.length : 0;

  // 2. DERIVED: Most Popular Item (item with highest total quantity across all orders)
  const itemFrequency = {};
  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (itemFrequency[item.name]) {
        itemFrequency[item.name] += item.quantity;
      } else {
        itemFrequency[item.name] = item.quantity;
      }
    });
  });
  const mostPopularItem = Object.keys(itemFrequency).reduce(
    (a, b) => (itemFrequency[a] > itemFrequency[b] ? a : b),
    "None"
  );

  // 3. DERIVED: Average Items Per Order (total items / total orders)
  const totalItems = orders.reduce((acc, order) => acc + order.items.length, 0);
  const averageItemsPerOrder =
    orders.length > 0 ? (totalItems / orders.length).toFixed(1) : 0;

  // 4. DERIVED: Revenue from Tax (percentage of total revenue from tax)
  const totalTax = orders.reduce((acc, order) => acc + order.bills.tax, 0);
  const taxPercentageOfRevenue =
    totalRevenue > 0 ? ((totalTax / totalRevenue) * 100).toFixed(1) : 0;

  // Card data with derived metrics
  const cardData = [
    {
      title: "Avg Order Value",
      value: `₹${averageOrderValue.toFixed(2)}`,
      percentage: "8%",
      isIncrease: true,
      color: "#2563EB", // blue
    },
    {
      title: "Most Popular Item",
      value: mostPopularItem,
      percentage: "15%",
      isIncrease: true,
      color: "#22C55E", // green
    },
    {
      title: "Avg Items/Order",
      value: averageItemsPerOrder,
      percentage: "12%",
      isIncrease: false,
      color: "#F59E0B", // yellow
    },
    {
      title: "Tax % of Revenue",
      value: `${taxPercentageOfRevenue}%`,
      percentage: "5%",
      isIncrease: true,
      color: "#DC2626", // red
    },
  ];

  return (
    <div className="container mx-auto py-2 px-6 md:px-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-[#f5f5f5] text-xl">
            Overall Performance
          </h2>
          <p className="text-sm text-[#ababab]">
            Derived insights from order collection processing
          </p>
        </div>
        {/* <button className="flex items-center gap-1 px-4 py-2 rounded-md text-[#f5f5f5] bg-[#1a1a1a]">
          Last 1 Month
          <svg
            className="w-3 h-3"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="4"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </button> */}
      </div>

      {/* 2x2 Cards Grid */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        {cardData.map((metric, index) => (
          <div
            key={index}
            className="shadow-sm rounded-lg p-4"
            style={{ backgroundColor: metric.color }}
          >
            <div className="flex justify-between items-center">
              <p className="font-medium text-xs text-[#f5f5f5]">
                {metric.title}
              </p>
              <div className="flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  style={{ color: metric.isIncrease ? "#f5f5f5" : "red" }}
                >
                  <path
                    d={metric.isIncrease ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                  />
                </svg>
                <p
                  className="font-medium text-xs"
                  style={{ color: metric.isIncrease ? "#f5f5f5" : "red" }}
                >
                  {metric.percentage}
                </p>
              </div>
            </div>
            <p className="mt-1 font-semibold text-2xl text-[#f5f5f5]">
              {metric.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Metrics;
