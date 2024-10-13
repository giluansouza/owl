import { Aperture } from "lucide-react";
import { Outlet } from "react-router-dom";

export const AppLayout = () => {
  return (
    <div>
      <div className="w-full h-12 bg-blue-950 shadow-md flex items-center justify-center px-4">
        <Aperture className="w-6 h-6 mr-2" color="white" />
        <h1 className="text-3xl font-bold text-center text-white">owl!</h1>
      </div>
      <Outlet />
    </div>
  );
};
