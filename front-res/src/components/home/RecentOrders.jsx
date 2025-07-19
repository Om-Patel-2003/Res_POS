import { FaSearch } from "react-icons/fa";
import OrderList from "./OrderList";
const RecentOrders = () => {
  return (
    // Note: The opening <div> for this section was missing in the image.
    // I've added a common pattern for a header.
    <>
      <div className="flex justify-between items-center px-8 my-2 ">
        <h1 className="text-[#f5f5f5] text-lg font-semibold tracking-wide">
          Recent Orders
        </h1>
        <a href="" className="text-[#025cca] text-sm font-semibold">
          View all
        </a>
      </div>

      <div className="flex items-center gap-4 bg-[#1f1f1f] rounded-[15px] px-6 py-4 mx-6">
        {/* This is likely an icon component from a library like 'react-icons' */}
        <FaSearch className="text-[#f5f5f5]" />
        <input
          type="text"
          placeholder="Search recent orders"
          className="bg-[#1f1f1f] outline-none text-[#f5f5f5] flex-1"
        />
      </div>

      <div className="pt-4 px-4 overflow-y-scroll h-[300px] scrollbar-hide">
        <OrderList />
        <OrderList />
        <OrderList />
        <OrderList />
        <OrderList />
        <OrderList />

        {/* Content for this div is not shown in the image */}
      </div>
    </>
  );
};

export default RecentOrders;
