import React from "react";
import BottomNav from "../components/shared/BottomNav";
import Greetings from "../components/home/Greetings";
import MiniCard from "../components/home/MiniCard";
import { BsCashCoin } from "react-icons/bs";
import { GrInProgress } from "react-icons/gr";
import RecentOrders from "../components/home/RecentOrders";
import PopularDishes from "../components/home/PopularDishes";

const Home = () => {
  return (
    <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden flex w-full gap-3 relative">
      {/* Left side */}
      <div className="flex-[3] flex flex-col h-full">
        <div className="flex-none">
          <Greetings />
        </div>

        {/* <div className="flex-none flex items-center w-full gap-3 px-8 mb-4">
          <MiniCard
            title="Total Earning"
            icon={<BsCashCoin />}
            number={512}
            footerNum={1.6}
          />
          <MiniCard
            title="In Progress"
            icon={<GrInProgress />}
            number={512}
            footerNum={3.6}
          />
        </div> */}

        {/* Recent Orders fills remaining space and leaves space for BottomNav */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <RecentOrders />
        </div>
      </div>

      {/* Right side */}
      <div className="flex-[1] h-full py-4 pr-4">
        <PopularDishes />
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0">
        <BottomNav />
      </div>
    </section>
  );
};

export default Home;
