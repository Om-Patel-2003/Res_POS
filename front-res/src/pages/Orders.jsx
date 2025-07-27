import React, { useState, useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import OrderCard from "../components/orders/OrderCard";
import BackButton from "../components/shared/BackButton";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getOrders } from "../https/index";
import { enqueueSnackbar } from "notistack";

const Orders = () => {
  const [status, setStatus] = useState("all");

  useEffect(() => {
    document.title = "POS | Orders";
  }, []);

  const { data: resData, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      return await getOrders();
    },
    placeholderData: keepPreviousData,
  });

  if (isError) {
    enqueueSnackbar("Something went wrong!", { variant: "error" });
  }

  // Filter orders based on selected status
  const filteredOrders = resData?.data.data.filter((order) => {
    if (status === "all") return true;
    if (status === "progress")
      return order.orderStatus !== "Ready" && order.orderStatus !== "Completed";
    if (status === "ready") return order.orderStatus === "Ready";
  });

  return (
    <section className="flex flex-col bg-[#1f1f1f] h-[calc(100vh-5rem)]">
      {/* Header */}
      <div className="flex items-center justify-between px-10 py-4">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider">
            Orders
          </h1>
        </div>
        <div className="flex items-center justify-around gap-4">
          {["all", "progress", "ready"].map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`text-[#ababab] text-lg font-semibold px-5 py-2 rounded-lg ${
                status === s && "bg-[#383838]"
              }`}
            >
              {s === "all"
                ? "All"
                : s === "progress"
                ? "In Progress"
                : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid */}
      <div className="flex-1 overflow-y-auto p-7 pb-24 scrollbar-hide">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders && filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))
          ) : (
            <p className="col-span-3 text-gray-500">No orders available</p>
          )}
        </div>
      </div>
      <BottomNav />
    </section>
  );
};

export default Orders;
