import { useEffect, useState } from "react";
import { GraphNetwork } from "../../components/graph-network";

import data from "@/assets/kumu-opropriogs-civic-canopy-2014-symposium.json";

interface Node {
  label: string;
  group: string;
  description: string;
}

export const Project = () => {
  const [activeGroupings, setActiveGroupings] = useState<string[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleGroupClick = (type: string) => {
    setActiveGroupings((prevGroupings) =>
      prevGroupings.includes(type)
        ? prevGroupings.filter((group) => group !== type)
        : [...prevGroupings, type]
    );
  };

  const handleNodeClick = (node: Node | null) => {
    setSelectedNode(node);
  };

  return (
    <div className="w-full h-screen px-6 py-4 bg-zinc-50">
      <h3 className="text-xl font-bold">Celebrity Ice Bucket Challenge</h3>
      <div className="relative w-full h-full bg-white flex items-center justify-center border shadow-xl overflow-hidden">
        <div className="absolute top-2 flex flex-col sm:flex-row gap-2">
          <span className="text-base font-bold text-center">
            Opções de agrupamento:
          </span>
          <button
            onClick={() => handleGroupClick("projects")}
            className="font-bold text-zinc-400"
          >
            Projetos
          </button>
          {/* <button
            onClick={() => handleGroupClick("location")}
            className="font-bold text-zinc-400"
          >
            Localização
          </button>
          <button
            onClick={() => handleGroupClick("organization")}
            className="font-bold text-zinc-400"
          >
            Organização
          </button> */}
        </div>
        <div className="w-full h-full flex flex-row items-center">
          <div className="w-1/3 h-full bg-zinc-50 p-4">
            <h2 className="text-2xl font-bold mt-4">{selectedNode?.label}</h2>
            <span className="font-semibold text-zinc-400">
              {selectedNode?.group}
            </span>
            <p className="mt-4">{selectedNode?.description}</p>
          </div>
          <GraphNetwork
            width={windowDimensions.width}
            height={windowDimensions.height * 1.3}
            bdData={data}
            activeGroupings={activeGroupings}
            onNodeClick={handleNodeClick}
            activerFilter="All"
          />
        </div>
      </div>
    </div>
  );
};
