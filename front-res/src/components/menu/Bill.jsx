import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTotalPrice, removeAllItems } from "../../redux/slices/cartSlice";
import { removeCustomer } from "../../redux/slices/customerSlice";
import {
  addOrder,
  createOrderRazorpay,
  updateTable,
  verifyPaymentRazorpay,
} from "../../https/index";
import { enqueueSnackbar } from "notistack";
import { useMutation } from "@tanstack/react-query";
import Invoice from "../invoice/Invoice";

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

const Bill = () => {
  const dispatch = useDispatch();

  const customerData = useSelector((state) => state.customer);
  const cartData = useSelector((state) => state.cart);
  console.log("Customer Data:", customerData);
  console.log("Cart Data:", cartData);

  const total = useSelector(getTotalPrice);
  const taxRate = 5.25;
  const tax = (total * taxRate) / 100;
  const totalPriceWithTax = total + tax;

  const [paymentMethod, setPaymentMethod] = useState();
  const [showInvoice, setShowInvoice] = useState(false);
  const [orderInfo, setOrderInfo] = useState();

  // Check if customer data is valid
  const isCustomerValid = () => {
    return customerData.customerName && customerData.customerName.trim() !== "";
  };

  const orderMutation = useMutation({
    mutationFn: (reqData) => addOrder(reqData),
    onSuccess: (resData) => {
      const { data } = resData.data;
      setOrderInfo(data);

      // Update Table
      const tableData = {
        status: "Booked",
        orderId: data._id,
        tableId: data.table,
      };
      setTimeout(() => {
        tableUpdateMutation.mutate(tableData);
      }, 1500);

      enqueueSnackbar("Order Placed!", { variant: "success" });
      setShowInvoice(true);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const tableUpdateMutation = useMutation({
    mutationFn: (reqData) => updateTable(reqData),
    onSuccess: (resData) => {
      dispatch(removeCustomer());
      dispatch(removeAllItems());
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handlePrintReceipt = () => {
    // Validate customer data first
    if (!isCustomerValid()) {
      enqueueSnackbar(
        "No customer information found! Please add customer details first.",
        {
          variant: "error",
        }
      );
      return;
    }

    // Add your print receipt logic here
    enqueueSnackbar("Receipt printing functionality coming soon!", {
      variant: "info",
    });
  };

  const handlePlaceOrder = async () => {
    // Validate customer data first
    if (!isCustomerValid()) {
      enqueueSnackbar(
        "No customer information found! Please add customer details first.",
        {
          variant: "error",
        }
      );
      return;
    }

    if (!paymentMethod) {
      enqueueSnackbar("Please select a payment method!", {
        variant: "warning",
      });
      return;
    }

    if (cartData.length === 0) {
      enqueueSnackbar("Cart is empty! Please add items to place order.", {
        variant: "warning",
      });
      return;
    }

    if (paymentMethod === "Online") {
      try {
        const res = await loadScript(
          "https://checkout.razorpay.com/v1/checkout.js"
        );
        if (!res) {
          enqueueSnackbar("Razorpay SDK failed to load. Are you online?", {
            variant: "warning",
          });
          return;
        }

        // create order
        const reqData = {
          amount: totalPriceWithTax.toFixed(2),
        };
        const { data } = await createOrderRazorpay(reqData);

        const options = {
          key: `${import.meta.env.VITE_RAZORPAY_KEY_ID}`,
          amount: data.order.amount,
          currency: data.order.currency,
          name: "RESTRO",
          description: "Secure Payment for Your Meal",
          order_id: data.order.id,
          handler: async function (response) {
            const verification = await verifyPaymentRazorpay(response);
            enqueueSnackbar(verification.data.message, { variant: "success" });

            // Place the order
            const orderData = {
              customerDetails: {
                name: customerData.customerName,
                phone: customerData.customerPhone,
                guests: customerData.guests,
              },
              orderStatus: "In Progress",
              bills: {
                total: total,
                tax: tax,
                totalWithTax: totalPriceWithTax,
              },
              items: cartData,
              table: customerData.table.tableId,
              paymentMethod: paymentMethod,
              paymentData: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
              },
            };

            setTimeout(() => {
              orderMutation.mutate(orderData);
            }, 1500);
          },
          prefill: {
            name: customerData.customerName || "",
            email: "",
            contact: customerData.customerPhone || "",
          },
          theme: { color: "#025cca" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        enqueueSnackbar("Payment Failed!", { variant: "error" });
      }
    } else {
      // cash order
      const orderData = {
        customerDetails: {
          name: customerData.customerName,
          phone: customerData.customerPhone,
          guests: customerData.guests,
        },
        orderStatus: "In Progress",
        bills: {
          total: total,
          tax: tax,
          totalWithTax: totalPriceWithTax,
        },
        items: cartData,
        table: customerData.table.tableId,
        paymentMethod: paymentMethod,
      };
      orderMutation.mutate(orderData);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between px-5 mt-2">
        <p className="text-xs text-[#ababab] font-medium mt-2">
          Items({cartData.length})
        </p>
        <h1 className="text-[#f5f5f5] text-md font-bold">
          ₹{total.toFixed(2)}
        </h1>
      </div>
      <div className="flex items-center justify-between px-5 mt-2">
        <p className="text-xs text-[#ababab] font-medium mt-2">Tax(5.25%)</p>
        <h1 className="text-[#f5f5f5] text-md font-bold">₹{tax.toFixed(2)}</h1>
      </div>
      <div className="flex items-center justify-between px-5 mt-2">
        <p className="text-xs text-[#ababab] font-medium mt-2">
          Total With Tax
        </p>
        <h1 className="text-[#f5f5f5] text-md font-bold">
          ₹{totalPriceWithTax.toFixed(2)}
        </h1>
      </div>

      {/* Customer Info Display */}
      {/* {isCustomerValid() && (
        <div className="px-5 mt-3 py-2 bg-[#1f1f1f] mx-5 rounded-lg">
          <p className="text-xs text-[#ababab] font-medium">Customer</p>
          <p className="text-sm text-[#f5f5f5] font-semibold">
            {customerData.customerName} | {customerData.guests} Guest(s)
          </p>
        </div>
      )} */}

      {/* Payment Method Selection */}
      <div className="flex items-center gap-3 px-5 mt-4">
        <button
          onClick={() => setPaymentMethod("Cash")}
          className={`bg-[#1f1f1f] px-4 py-3 w-full rounded-lg text-[#ababab] font-semibold transition-colors ${
            paymentMethod === "Cash" ? "bg-[#383737] text-[#f5f5f5]" : ""
          }`}
        >
          Cash
        </button>
        <button
          onClick={() => setPaymentMethod("Online")}
          className={`bg-[#1f1f1f] px-4 py-3 w-full rounded-lg text-[#ababab] font-semibold transition-colors ${
            paymentMethod === "Online" ? "bg-[#383737] text-[#f5f5f5]" : ""
          }`}
        >
          Online
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 px-5 mt-4">
        <button
          onClick={handlePrintReceipt}
          disabled={!isCustomerValid() || cartData.length === 0}
          className={`px-4 py-3 w-full rounded-lg font-semibold text-lg transition-colors ${
            !isCustomerValid() || cartData.length === 0
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-[#025cca] text-[#f5f5f5] hover:bg-[#0248a3]"
          }`}
        >
          Print Receipt
        </button>
        <button
          onClick={handlePlaceOrder}
          disabled={
            !isCustomerValid() ||
            cartData.length === 0 ||
            orderMutation.isPending
          }
          className={`px-4 py-3 w-full rounded-lg font-semibold text-lg transition-colors ${
            !isCustomerValid() ||
            cartData.length === 0 ||
            orderMutation.isPending
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-[#f6b100] text-[#1f1f1f] hover:bg-[#e6a000]"
          }`}
        >
          {orderMutation.isPending ? "Placing Order..." : "Place Order"}
        </button>
      </div>

      {/* Warning Message */}
      {!isCustomerValid() && (
        <div className="px-5">
          <p className="text-xs text-red-400 text-center">
            ⚠️ Customer information required to proceed
          </p>
        </div>
      )}

      {showInvoice && (
        <Invoice orderInfo={orderInfo} setShowInvoice={setShowInvoice} />
      )}
    </>
  );
};

export default Bill;
