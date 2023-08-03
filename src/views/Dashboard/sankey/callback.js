import * as d3 from "d3";
import Highcharts from "highcharts";

import Cookies from "universal-cookie";
import i18n from '~/i18n';
const cookies = new Cookies();
const language = cookies.get("localeLang") || "en";
const translatedData = i18n.logger.options.resources[language].translation.componentData.reduxData;

const Callback = (chart, data) => {
  const points = chart.series[0].nodes;

  const trimTextByLength = (text, length) => {
    return `${String(Boolean(text) && text).substring(0, length)}...`;
  };

  const firstColumnRendering = (point, i) => {
    const element = point && point.graphic && point.graphic.element;
    const info = data && data["description"] && data["description"].filter((obj) => obj["campaign"] == point.id)[0];

    const nodeHeigth = element && element.getAttribute("height");

    /* Extra Rect */
    const parent = d3.selectAll(".highcharts-tracker");
    parent.append("rect")
      .attr("x", element && element.getAttribute("x") + 15)
      .attr("y", element && element.getAttribute("y"))
      .attr("width", 20)
      .attr("fill", element && element.getAttribute("fill"))
      .attr("height", element && element.getAttribute("height"));

    if (info["campaign"] == point.id) {
      // if (nodeHeigth < 70) {
        const textLength = info && info["campaign"] && info["campaign"].length;
        const actualText = textLength > 14 ? trimTextByLength(point.id, 12) : point.id;
        chart.renderer
          .text(`${point && point.sum} ${actualText}`, 10, Number(nodeHeigth) / 2 + Number(element && element.getAttribute("y")) + 14.5)
          .attr({ rotation: 0, })
          .attr("class", "customText")
          .css({
            color: "#000000",
            fontSize: "16px",
            fontWeight: "500px",
            fontFamily: "'Interstate', Arial, Helvetica, sans-serif"
          })
          .add();

        chart.renderer
          .text(info && info["description"], 10, Number(nodeHeigth) / 2 + Number(element && element.getAttribute("y")) + 30)
          .attr({
            rotation: 0,
          })
          .attr("class", "customText")
          .css({
            color: info && info["status"] == "Completed" ? "#4F9A00" : "#007AFF",
            fontSize: "12px",
            class: "customText"
          })
          .add();
      // } else {
      //   const textLength = info && info["campaign"] && info["campaign"].length;
      //   const actualText = textLength > 14 ? trimTextByLength(point.id, 12) : point.id;
      //   chart.renderer
      //     .text(`${point && point.sum}`, 10, Number(nodeHeigth) / 2 + Number(element && element.getAttribute("y")) + -4)
      //     .attr({ rotation: 0, })
      //     .attr("class", "customText")
      //     .css({
      //       color: "#000000",
      //       fontSize: "22px",
      //       fontWeight: "500px",
      //       fontFamily: "'Interstate', Arial, Helvetica, sans-serif"
      //     })
      //     .add();
      //   chart.renderer
      //     .text(`${actualText}`, 10, Number(nodeHeigth) / 2 + Number(element && element.getAttribute("y")) + 14.5)
      //     .attr({ rotation: 0, })
      //     .attr("class", "customText")
      //     .css({
      //       color: "#000000",
      //       fontSize: "14px",
      //       fontWeight: "500px",
      //       fontFamily: "'Interstate', Arial, Helvetica, sans-serif"
      //     })
      //     .add();
          
      //   if (info && info["status"] != "Completed") {
      //     chart.renderer
      //       .text(translatedData[info && info["status"]], 10, Number(nodeHeigth) / 2 + Number(element && element.getAttribute("y")) + 33)
      //       .attr({ rotation: 0, })
      //       .attr("class", "customText")
      //       .css({
      //         color: info && info["status"] == "Completed" ? "#4F9A00" : "#007AFF",
      //         fontSize: "12px",
      //       })
      //       .add();
      //   }

      //   const firstText = info && info["description"].split(" ")[0];
      //   const secondText = info && info["description"].substring((info && info["description"]).indexOf(' ') + 1);
      //   chart.renderer
      //     .text(firstText, 10, Number(nodeHeigth) / 2 + Number(element && element.getAttribute("y")) + (info && info["status"] == "Completed" ? 28 : 48))
      //     .attr({
      //       rotation: 0,
      //     })
      //     .attr("class", "customText")
      //     .css({
      //       color: info && info["status"] == "Completed" ? "#4F9A00" : "#007AFF",
      //       fontSize: "12px",
      //       class: "customText"
      //     })
      //     .add();

      //   chart.renderer
      //     .text(secondText, 10, Number(nodeHeigth) / 2 + Number(element && element.getAttribute("y")) + (info && info["status"] == "Completed" ? 42 : 60))
      //     .attr({
      //       rotation: 0,
      //     })
      //     .attr("class", "customText")
      //     .css({
      //       color: info && info["status"] == "Completed" ? "#4F9A00" : "#007AFF",
      //       fontSize: "12px",
      //       class: "customText"
      //     })
      //     .add();
      // }
    }
  };

  const lastColumnRendering = (point) => {
    const _element = point && point.graphic &&
      point.graphic.element;
    const _width = document
      .getElementsByClassName(
        "highcharts-plot-border"
      )[0]
      .getAttribute("width");

    const renderer = new Highcharts.Renderer(
      document.getElementsByClassName('highcharts-tracker')[0], 400,
      300
    );
  };

  points &&
    points.forEach((point, i) => {
      if (point.column == 0 && point.isNode) {
        firstColumnRendering(point, i);
      }
      if (point.column == 2 && point.isNode) {
        // lastColumnRendering(point);
      }
    });
}

export default Callback;