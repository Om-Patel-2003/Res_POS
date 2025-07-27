import React, { useState } from "react";
import { FaHome } from "react-icons/fa";
import { MdOutlineReorder, MdTableBar } from "react-icons/md";
import { CiCircleMore } from "react-icons/ci";
import { BiSolidDish } from "react-icons/bi";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "./Modal";
import { useDispatch } from "react-redux";
import { setCustomer } from "../../redux/slices/customerSlice";
import { enqueueSnackbar } from "notistack";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guestCount, setGuestCount] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    clearForm();
    setIsModalOpen(false);
  };

  const increment = () => {
    if (guestCount >= 6) return;
    setGuestCount((prev) => prev + 1);
  };

  const decrement = () => {
    if (guestCount <= 1) return;
    setGuestCount((prev) => prev - 1);
  };

  const isActive = (path) => location.pathname === path;

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Customer name is required";

    if (!phone.trim()) {
      newErrors.phone = "Customer phone is required";
    } else if (!/^\d{10}$/.test(phone.trim())) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    if (guestCount < 1) newErrors.guestCount = "Guest count must be at least 1";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearForm = () => {
    setName("");
    setPhone("");
    setGuestCount(1);
    setErrors({});
  };

  const handleCreateOrder = () => {
    if (!validate()) return;
    dispatch(
      setCustomer({
        name: name.trim(),
        phone: phone.trim(),
        guests: guestCount,
      })
    );
    enqueueSnackbar("Order details saved!", { variant: "success" });
    clearForm();
    setIsModalOpen(false);
    navigate("/tables");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#262626] p-2 h-16 flex justify-around">
      <button
        onClick={() => navigate("/")}
        className={`flex items-center justify-center font-bold ${
          isActive("/") ? "text-[#f5f5f5] bg-[#343434]" : "text-[#ababab]"
        } w-[300px] rounded-[20px]`}
      >
        <FaHome className="inline mr-2" size={20} /> <p>Home</p>
      </button>

      <button
        onClick={() => navigate("/orders")}
        className={`flex items-center justify-center font-bold ${
          isActive("/orders") ? "text-[#f5f5f5] bg-[#343434]" : "text-[#ababab]"
        } w-[300px] rounded-[20px]`}
      >
        <MdOutlineReorder className="inline mr-2" size={20} /> <p>Orders</p>
      </button>

      <button
        onClick={() => navigate("/tables")}
        className={`flex items-center justify-center font-bold ${
          isActive("/tables") ? "text-[#f5f5f5] bg-[#343434]" : "text-[#ababab]"
        } w-[300px] rounded-[20px]`}
      >
        <MdTableBar className="inline mr-2" size={20} /> <p>Tables</p>
      </button>

      <button className="flex items-center justify-center font-bold text-[#ababab] w-[300px]">
        <CiCircleMore className="inline mr-2" size={20} /> <p>More</p>
      </button>

      <button
        disabled={isActive("/tables") || isActive("/menu")}
        onClick={openModal}
        className="absolute bottom-6 bg-[#F6B100] text-[#f5f5f5] rounded-full p-4 items-center"
        aria-label="Create Order"
        title="Create Order"
      >
        <BiSolidDish size={40} />
      </button>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Create Order">
        <div className="space-y-4">
          {/* Customer Name */}
          <div>
            <label
              htmlFor="customer-name"
              className="block text-[#ababab] mb-2 text-sm font-medium"
            >
              Customer Name
            </label>
            <input
              id="customer-name"
              type="text"
              placeholder="Enter customer name"
              value={name}
              onChange={(e) => {
                const filtered = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                setName(filtered);
              }}
              className={`bg-[#1f1f1f] rounded-lg p-3 px-4 w-full text-white focus:outline-none ${
                errors.name ? "border border-red-500" : ""
              }`}
              aria-invalid={!!errors.name}
              aria-describedby="name-error"
            />
            {errors.name && (
              <p id="name-error" className="text-red-500 text-xs mt-1">
                {errors.name}
              </p>
            )}
          </div>

          {/* Customer Phone */}
          <div>
            <label
              htmlFor="customer-phone"
              className="block text-[#ababab] mb-2 text-sm font-medium"
            >
              Customer Phone
            </label>
            <input
              id="customer-phone"
              type="text"
              placeholder="Enter 10 digit phone number"
              maxLength={10} // restrict length in UI
              value={phone}
              onChange={(e) => {
                // remove anything that's not digit and limit length
                const filtered = e.target.value.replace(/\D/g, "").slice(0, 10);
                setPhone(filtered);
              }}
              onKeyDown={(e) => {
                // Optional: prevent non-digit input explicitly
                const allowedKeys = [
                  "Backspace",
                  "ArrowLeft",
                  "ArrowRight",
                  "Delete",
                  "Tab",
                ];
                if (!/\d/.test(e.key) && !allowedKeys.includes(e.key)) {
                  e.preventDefault();
                }
              }}
              className={`bg-[#1f1f1f] rounded-lg p-3 px-4 w-full text-white focus:outline-none ${
                errors.phone ? "border border-red-500" : ""
              }`}
              aria-invalid={!!errors.phone}
              aria-describedby="phone-error"
            />
            {errors.phone && (
              <p id="phone-error" className="text-red-500 text-xs mt-1">
                {errors.phone}
              </p>
            )}
          </div>

          {/* Guest Count */}
          <div>
            <label
              htmlFor="guest-count"
              className="block mb-2 text-sm font-medium text-[#ababab]"
            >
              Guest
            </label>
            <div
              id="guest-count"
              className={`flex items-center justify-between bg-[#1f1f1f] px-4 py-3 rounded-lg ${
                errors.guestCount ? "border border-red-500" : ""
              }`}
            >
              <button
                type="button"
                onClick={decrement}
                aria-label="Decrease guest count"
                className="text-yellow-500 text-2xl select-none"
              >
                &minus;
              </button>
              <span className="text-white select-none">
                {guestCount} {guestCount > 1 ? "Persons" : "Person"}
              </span>
              <button
                type="button"
                onClick={increment}
                aria-label="Increase guest count"
                className="text-yellow-500 text-2xl select-none"
              >
                &#43;
              </button>
            </div>
            {errors.guestCount && (
              <p className="text-red-500 text-xs mt-1">{errors.guestCount}</p>
            )}
          </div>

          {/* Create Order Button */}
          <button
            onClick={handleCreateOrder}
            className="w-full bg-[#F6B100] text-[#f5f5f5] rounded-lg py-3 mt-8 hover:bg-yellow-700 transition-colors"
            type="button"
          >
            Create Order
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default BottomNav;
