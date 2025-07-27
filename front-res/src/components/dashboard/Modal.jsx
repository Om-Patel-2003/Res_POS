import React, { useState } from "react";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { useMutation } from "@tanstack/react-query";
import { addTable } from "../../https";
import { enqueueSnackbar } from "notistack";

const Modal = ({ setIsTableModalOpen }) => {
  // Configuration - you can adjust these limits as needed
  const MAX_TABLE_NUMBER = 10;
  const MAX_SEATS = 5;
  const MIN_VALUE = 1;

  const [tableData, setTableData] = useState({
    tableNo: "",
    seats: "",
  });

  const [errors, setErrors] = useState({
    tableNo: "",
    seats: "",
  });

  // Validation function - only shows errors for invalid values, not empty ones
  const validateInput = (name, value) => {
    // If empty, don't show error (but we'll disable button)
    if (!value.trim()) {
      return "";
    }

    const numValue = parseInt(value);
    let error = "";

    if (isNaN(numValue) || numValue < MIN_VALUE) {
      error = `Minimum value is ${MIN_VALUE}`;
    } else if (name === "tableNo" && numValue > MAX_TABLE_NUMBER) {
      error = `Maximum table number is ${MAX_TABLE_NUMBER}`;
    } else if (name === "seats" && numValue > MAX_SEATS) {
      error = `Maximum seats per table is ${MAX_SEATS}`;
    }

    return error;
  };

  // Check if form is valid for submission
  const isFormValid = () => {
    const hasAllFields = tableData.tableNo.trim() && tableData.seats.trim();
    const hasNoErrors = !errors.tableNo && !errors.seats;
    return hasAllFields && hasNoErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Allow only positive integers
    const filteredValue = value.replace(/[^0-9]/g, "");

    // Validate the input (won't show errors for empty fields)
    const error = validateInput(name, filteredValue);

    // Update state
    setTableData((prev) => ({ ...prev, [name]: filteredValue }));
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Final validation before submission
    if (!tableData.tableNo.trim() || !tableData.seats.trim()) {
      enqueueSnackbar("Please fill in all fields", { variant: "error" });
      return;
    }

    const tableNoError = validateInput("tableNo", tableData.tableNo);
    const seatsError = validateInput("seats", tableData.seats);

    if (tableNoError || seatsError) {
      setErrors({
        tableNo: tableNoError,
        seats: seatsError,
      });
      enqueueSnackbar("Please fix the errors before submitting", {
        variant: "error",
      });
      return;
    }

    // Convert to numbers for API call
    const submissionData = {
      tableNo: parseInt(tableData.tableNo),
      seats: parseInt(tableData.seats),
    };

    console.log(submissionData);
    tableMutation.mutate(submissionData);
  };

  const handleCloseModal = () => {
    // Reset form data and errors when closing
    setTableData({ tableNo: "", seats: "" });
    setErrors({ tableNo: "", seats: "" });
    setIsTableModalOpen(false);
  };

  const tableMutation = useMutation({
    mutationFn: (reqData) => addTable(reqData),
    onSuccess: (res) => {
      setIsTableModalOpen(false);
      // Reset form data
      setTableData({ tableNo: "", seats: "" });
      setErrors({ tableNo: "", seats: "" });
      const { data } = res;
      enqueueSnackbar(data.message || "Table added successfully!", {
        variant: "success",
      });
    },
    onError: (error) => {
      const { data } = error.response || {};
      enqueueSnackbar(data?.message || "Failed to add table", {
        variant: "error",
      });
      console.error(error);
    },
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-[#262626] p-6 rounded-lg shadow-lg w-96"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[#f5f5f5] text-xl font-semibold">Add Table</h2>
          <button
            onClick={handleCloseModal}
            className="text-[#f5f5f5] hover:text-red-500 transition-colors"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          {/* Table Number Input */}
          <div>
            <label className="block text-[#ababab] mb-2 text-sm font-medium">
              Table Number (1-{MAX_TABLE_NUMBER})
            </label>
            <div
              className={`flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f] ${
                errors.tableNo ? "border border-red-500" : ""
              }`}
            >
              <input
                type="text"
                name="tableNo"
                value={tableData.tableNo}
                onChange={handleInputChange}
                placeholder="Enter table number"
                className="bg-transparent flex-1 text-white focus:outline-none"
                maxLength="3"
              />
            </div>
            {errors.tableNo && (
              <p className="text-red-500 text-xs mt-1">{errors.tableNo}</p>
            )}
          </div>

          {/* Seats Input */}
          <div>
            <label className="block text-[#ababab] mb-2 text-sm font-medium">
              Number of Seats (1-{MAX_SEATS})
            </label>
            <div
              className={`flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f] ${
                errors.seats ? "border border-red-500" : ""
              }`}
            >
              <input
                type="text"
                name="seats"
                value={tableData.seats}
                onChange={handleInputChange}
                placeholder="Enter number of seats"
                className="bg-transparent flex-1 text-white focus:outline-none"
                maxLength="2"
              />
            </div>
            {errors.seats && (
              <p className="text-red-500 text-xs mt-1">{errors.seats}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={tableMutation.isPending || !isFormValid()}
            className={`w-full rounded-lg mt-6 py-3 text-lg font-bold transition-colors ${
              tableMutation.isPending || !isFormValid()
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-yellow-400 text-gray-900 hover:bg-yellow-500"
            }`}
          >
            {tableMutation.isPending ? "Adding Table..." : "Add Table"}
          </button>
        </form>

        {/* Info Text */}
        {/* <div className="mt-4 text-xs text-[#ababab] text-center">
          Table number: 1-{MAX_TABLE_NUMBER} | Seats: 1-{MAX_SEATS}
        </div> */}
      </motion.div>
    </div>
  );
};

export default Modal;
