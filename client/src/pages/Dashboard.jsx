import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { DashProfile, DashSidebar } from "../components/index.js";

const Dashboard = () => {

  const location = useLocation();

  const [tab, settab] = useState("");

  useEffect(() => { 
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');

    if (tabFromUrl) {
      settab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row"> 
      <div className="md:w-56">
        {/* Sidebar */}
        <DashSidebar />
      </div>
      <div className="">
        {/* Main Content */}
        {tab === "profile" && <DashProfile />}
      </div>
    </div>
  )
}

export default Dashboard