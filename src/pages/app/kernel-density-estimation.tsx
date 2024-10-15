import HistogramChart from "@/components/kde";
import data from "@/assets/faithful.json";

export const KernelDensityEstimation = () => {
  return (
    <div className="w-full h-screen px-6 py-4 bg-zinc-50">
      <h3 className="text-xl font-bold">Celebrity Ice Bucket Challenge</h3>
      <div className="relative w-full h-full bg-white flex items-center justify-center border shadow-xl overflow-hidden">
        <div className="w-full h-full flex flex-row items-center">
          <HistogramChart data={data} />
        </div>
      </div>
    </div>
  );
};
