import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const getColorByElementType = (type: string) => {
  switch (type) {
    case "Person":
      return "#acbfcb";
    case "Organization":
      return "#D62728";
    case "Region":
      return "#2CA02C";
    default:
      return "#a4a6a8";
  }
};

const getRadiusByElementType = (type: string) => {
  switch (type) {
    case "Person":
      return 16;
    case "Region":
      return 8;
    default:
      return 8;
  }
};

export const GraphNetwork = ({
  bdData,
  width,
  height,
  activeGroupings,
  onNodeClick,
  showNodes,
}: {
  bdData: any;
  width: number;
  height: number;
  activeGroupings: string[];
  onNodeClick: (node: any) => void;
  showNodes: string[];
}) => {
  const svgRef = useRef();
  const [data, setData] = useState(bdData);

  useEffect(() => {
    // Escala de cores para os grupos
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Filtrar os nós com base nos agrupamentos ativos
    const filterNodes = () => {
      if (showNodes.length > 0) {
        return data.elements.filter((element) =>
          showNodes.includes(element.attributes["element type"])
        );
      }

      // Caso contrário, mostrar todos os nós e filtrar os links com base nos agrupamentos
      return data.elements.filter((element) => {
        if (
          activeGroupings.includes("organization") &&
          element.attributes["element type"] === "Organization"
        )
          return true;
        if (
          activeGroupings.includes("region") &&
          element.attributes["element type"] === "Region"
        )
          return true;
        return true;
      });
    };

    const nodes = filterNodes().map((element) => ({
      id: element._id,
      label: element.attributes.label,
      group: element.attributes["element type"] || "Unknown",
      description: element.attributes.description,
      image:
        element.attributes.image || "https://example.com/default-image.png",
    }));

    // Gerar os links com base nos agrupamentos ativos
    const generateLinks = () => {
      const links = [];

      if (activeGroupings.includes("organization")) {
        links.push(
          ...data.elements
            .filter(
              (element) =>
                element.attributes["element type"] === "Person" &&
                element.attributes["organization"]
            )
            .flatMap((element) => {
              const initiatives = Array.isArray(
                element.attributes["organization"]
              )
                ? element.attributes["organization"]
                : [element.attributes["organization"]];

              return initiatives
                .map((initiative) => ({
                  source: element._id,
                  target: data.elements.find(
                    (e) => e.attributes.label === initiative
                  )?._id,
                  value: 1,
                }))
                .filter((link) => link.source && link.target); // Filtra links inválidos
            })
        );
      }

      // Adicione lógica para outras opções de agrupamento, como Localização e Organização
      if (activeGroupings.includes("region")) {
        links.push(
          ...data.elements
            .filter(
              (element) => element.attributes["element type"] === "Person"
            )
            .flatMap((element) => {
              const regions = Array.isArray(element.attributes["region"])
                ? element.attributes["region"]
                : [element.attributes["region"]];

              return regions
                .map((region) => ({
                  source: element._id,
                  target: data.elements.find(
                    (e) => e.attributes.label === region
                  )?._id,
                  value: 1,
                }))
                .filter((link) => link.source && link.target); // Filtra links inválidos
            })
        );
      }

      return links;
    };

    const links = activeGroupings.length > 0 ? generateLinks() : [];

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .style("max-width", "100%")
      .style("height", "auto");

    svg.selectAll("*").remove();

    // Cria um grupo para os elementos do gráfico, que será escalado com o zoom
    const g = svg.append("g");

    // Configura a funcionalidade de zoom
    const zoom = d3
      .zoom()
      .scaleExtent([0.3, 5]) // Limita o zoom de 0.5x a 5x
      .on("zoom", (event) => {
        g.attr("transform", event.transform); // Aplica o zoom e o pan ao grupo
      });

    svg.call(zoom); // Adiciona o comportamento de zoom ao SVG

    // Configura a simulação de força
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance(150)
      )
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2))
      .on("tick", ticked);

    // Criação dos links
    const link = g
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", (d) => Math.sqrt(d.value * 10));

    // Criação dos nós
    const node = g
      .append("g")
      .selectAll("g")
      .data(nodes)
      .join("g") // Usando 'g' para agrupar o círculo e o texto
      .on("click", (event, d) => {
        if (onNodeClick) onNodeClick(d);
      })
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    // Adiciona o círculo para cada nó
    node
      .append("circle")
      .attr("r", (d) => getRadiusByElementType(d.group))
      .attr("stroke-width", 3)
      .attr("stroke", "#e6e6e6")
      .attr("fill", (d) => getColorByElementType(d.group));

    node
      .filter(
        (d) => d.image && typeof d.image === "string" && d.image.trim() !== ""
      )
      .append("image")
      .attr("xlink:href", (d) => d.image)
      .attr("x", -16) // Centraliza a imagem no círculo
      .attr("y", -16) // Centraliza a imagem no círculo
      .attr("width", 36) // Tamanho da imagem
      .attr("height", 36) // Tamanho da imagem
      .on("error", function () {
        d3.select(this).remove(); // Remove a imagem se ocorrer um erro ao carregar
      });

    // Adiciona o rótulo abaixo do nó
    node
      .append("text")
      .attr("x", 0)
      .attr("y", 30) // Posição abaixo do nó
      .attr("text-anchor", "middle")
      .attr("font-size", "0.8em")
      .attr("fill", "#000")
      .text((d) => d.label);

    node.append("title").text((d) => d.label);

    function ticked() {
      link
        .attr("x1", (d) => (d.source ? d.source.x : 0))
        .attr("y1", (d) => (d.source ? d.source.y : 0))
        .attr("x2", (d) => (d.target ? d.target.x : 0))
        .attr("y2", (d) => (d.target ? d.target.y : 0));

      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    }

    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => simulation.stop();
  }, [data, width, height, activeGroupings, showNodes]);

  return <svg ref={svgRef}></svg>;
};
