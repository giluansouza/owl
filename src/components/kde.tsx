import { useEffect, useRef } from "react";
import * as d3 from "d3";

const HistogramChart = ({ data = [] }: { data: number[] }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 960;
    const height = 500;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    const x = d3
      .scaleBand()
      .domain(data.map((_, i) => i + 1)) // Considerar os dias do mês
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data)]) // Ajustar o domínio para o máximo valor dos dados
      .range([height - margin.bottom, margin.top]);

    svg.selectAll("*").remove(); // Limpar qualquer conteúdo anterior

    // Eixo X
    svg
      .append("g")
      .attr("class", "axis axis--x")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat((d) => `${d}`))
      .append("text")
      .attr("x", width - margin.right)
      .attr("y", -6)
      .attr("fill", "#000")
      .attr("text-anchor", "end")
      .attr("font-weight", "bold")
      .text("Dias do Mês");

    // Eixo Y
    svg
      .append("g")
      .attr("class", "axis axis--y")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .text("CVLI");

    // Barras do histograma
    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d, i) => x(i + 1)) // Mapeia o dia para a posição x
      .attr("y", (d) => y(d)) // A altura da barra é o valor de CVLI
      .attr("width", x.bandwidth()) // Largura da barra
      .attr("height", (d) => y(0) - y(d)); // Altura da barra

    // Calcular a densidade
    const density = kernelDensityEstimator(
      kernelEpanechnikov(10),
      x.domain().map((d) => d) // Usar o domínio do eixo x
    )(data.map((d, i) => [i + 1, d])); // Passar os dados como coordenadas [dia, CVLI]

    // Curva de densidade
    svg
      .append("path")
      .datum(density)
      .attr("fill", "none")
      .attr("stroke", "#9c1212")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr(
        "d",
        d3
          .line()
          .curve(d3.curveBasis)
          .x((d) => x(d[0])) // Usar o dia como coordenada x
          .y((d) => y(d[1])) // Usar a densidade como coordenada y
      );

    function kernelDensityEstimator(kernel, X) {
      return function (V) {
        return X.map((x) => [x, d3.mean(V, (v) => kernel(x - v[0]))]);
      };
    }

    function kernelEpanechnikov(k) {
      return function (v) {
        return Math.abs((v /= k)) <= 1 ? (0.75 * (1 - v * v)) / k : 0;
      };
    }
  }, [data]); // Adicionar data como dependência

  return <svg ref={svgRef} width={960} height={500}></svg>;
};

export default HistogramChart;
