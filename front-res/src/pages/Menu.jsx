import React, { useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import BackButton from "../components/shared/BackButton";
import { MdRestaurantMenu } from "react-icons/md";
import MenuContainer from "../components/menu/MenuContainer";
import CustomerInfo from "../components/menu/CustomerInfo";
import CartInfo from "../components/menu/CartInfo";
import Bill from "../components/menu/Bill";

const Menu = () => {
  return (
    <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-y-scroll scrollbar-hide flex gap-3">
      {/* Left Div */}
      <div className="flex-[3]">
        <div className="flex items-center justify-between px-10 py-4">
          <div className="flex items-center gap-4">
            <BackButton />
            <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider">
              Menu
            </h1>
          </div>
          <div className="flex items-center justify-around gap-4"></div>
        </div>

        <MenuContainer />
      </div>
      {/* Right Div */}
      <div className="flex-[1]  mt-4 mr-3 h-[780px] rounded-lg pt-2">
        <CustomerInfo />
        <hr className="border-[#2a2a2a] border-t-2" />
        {/* Cart Items */}
        <CartInfo />
        <hr className="border-[#2a2a2a] border-t-2" />
        Bills
        <Bill />
      </div>

      <BottomNav />
    </section>
  );
};

export default Menu;
