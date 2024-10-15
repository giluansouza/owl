import { useEffect, useState } from "react";
import { GraphNetwork } from "../../components/graph-network";

import data from "@/assets/76-cipm.json";
import { EllipsisVertical } from "lucide-react";

interface Node {
  label: string;
  group: string;
  description: string;
}

export const AnalysisNetwork76 = () => {
  const [showPanel, setShowPanel] = useState<boolean>(false);
  const [showNode, setShowNodes] = useState<string[]>(["Person"]);
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

    // Adicionando/removendo tipos de nós
    if (type === "organization" && !showNode.includes("Organization")) {
      toggleNode("Organization");
    }
    if (type === "region" && !showNode.includes("Region")) {
      toggleNode("Region");
    }
    if (type === "partners" && !showNode.includes("Person")) {
      toggleNode("Person");
    }
  };

  const toggleNode = (node: string) => {
    setShowNodes((prevNodes) =>
      prevNodes.includes(node)
        ? prevNodes.filter((n) => n !== node)
        : [...prevNodes, node]
    );
  };

  const handleNodeClick = (node: Node | null) => {
    setSelectedNode(node);
    if (!showPanel) {
      setShowPanel(true);
    }
  };

  return (
    <div className="w-full h-screen px-6 py-4 bg-zinc-50">
      <div className="flex flex-row gap-2 justify-between">
        <h3 className="text-xl font-bold">{data.name}</h3>
        <div className="flex sm:flex-row items-center gap-2">
          <span className="text-base font-bold text-center">Exibir:</span>
          <button
            onClick={() => toggleNode("Person")}
            className={`font-bold ${
              showNode.includes("Person") ? "text-zinc-300" : "text-zinc-500"
            }`}
          >
            Pessoas
          </button>
          <button
            onClick={() => toggleNode("Region")}
            className={`font-bold ${
              showNode.includes("Region") ? "text-zinc-300" : "text-zinc-500"
            }`}
          >
            Região
          </button>
          <button
            onClick={() => toggleNode("Organization")}
            className={`font-bold ${
              showNode.includes("Organization")
                ? "text-zinc-300"
                : "text-zinc-500"
            }`}
          >
            Facção
          </button>
        </div>
        <div className="flex sm:flex-row items-center gap-2">
          <span className="text-base font-bold text-center">Agrupar por:</span>
          <button
            onClick={() => handleGroupClick("organization")}
            className={`font-bold ${
              activeGroupings.includes("organization")
                ? "text-zinc-300"
                : "text-zinc-500"
            }`}
          >
            Facção
          </button>
          <button
            onClick={() => handleGroupClick("region")}
            className={`font-bold ${
              activeGroupings.includes("region")
                ? "text-zinc-300"
                : "text-zinc-500"
            }`}
          >
            Região
          </button>

          {/* <button
            onClick={() => handleGroupClick("partners")}
            className={`font-bold ${
              showNode.includes("partners") ? "text-zinc-300" : "text-zinc-500"
            }`}
          >
            Parceria
          </button> */}
        </div>
      </div>
      <div className="relative w-full h-[90vh] bg-white flex items-center justify-center border shadow-xl overflow-hidden">
        <div className="w-full h-full flex flex-row items-center">
          <div
            className={`${
              showPanel ? "flex flex-col w-1/3 p-4" : "w-0 hidden"
            } h-full bg-zinc-50 transition-all duration-300`}
          >
            <h2 className="text-2xl font-bold mt-4">{selectedNode?.label}</h2>
            <span className="font-semibold text-zinc-400">
              {selectedNode?.group}
            </span>
            <p className="mt-4">{selectedNode?.description}</p>
          </div>
          <button onClick={() => setShowPanel(!showPanel)}>
            <EllipsisVertical />
          </button>
          <GraphNetwork
            width={windowDimensions.width}
            height={windowDimensions.height * 1.3}
            bdData={data}
            activeGroupings={activeGroupings}
            onNodeClick={handleNodeClick}
            showNodes={showNode}
          />
        </div>
      </div>
    </div>
  );
};
