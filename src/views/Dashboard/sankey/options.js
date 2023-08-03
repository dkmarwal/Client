import * as d3 from "d3";

export const Options = (data) => {
  return {
    title: {
      text: "",
    },
    accessibility: {
      point: {
        valueDescriptionFormat:
          "{index}. {point.from} to {point.to}, {point.weight}.",
      },
    },
    className: "customNode-{point.column}",
    dataLabels: {},
    chart: {
      styledMode: false,
      marginLeft: 180,
      marginRight: 100,
      // height: 400,
      // width: 800,
      events: {
        render: function (e) {
          let maxColumns = 0;
          const nodes = e && e.target && e.target.series && e.target.series[0] && e.target.series[0].nodes;

          const _lastColumnRendering = (
            point, offset
          ) => {
            const _element = point && point.graphic && point.graphic.element;
            const elementsWithClass = document.getElementsByClassName(_element && _element.getAttribute("class"));
            const _offset = offset ? offset : 0;
            const id = String((point && point.id) || "");
            
            const selector = id.replace(/ /g,"").replace(/&/g,"").trim();
            //Find existing extra columns svg elements and remove (if any);
            const elementFinder = d3.selectAll(`#extraColumn${selector}`);
            elementFinder.remove();

            //Then again adding new svg element on the run to keep the columns re-rendering and maintain responsiveness.
            const parent = d3.selectAll(".highcharts-tracker");
            parent.append("rect")
              .attr("x", Number(_element && _element.getAttribute("x")) - 15 + _offset)
              .attr("y", _element && _element.getAttribute("y"))
              .attr("id", `extraColumn${selector}`)
              .attr("width", 20)
              .attr("fill", _element && _element.getAttribute("fill"))
              .attr("height", _element && _element.getAttribute("height"));

            if(elementsWithClass && elementsWithClass.length > 0){
                Array.prototype.forEach.call(elementsWithClass, function(elm, i) {
                  const el = document.getElementsByClassName("highcharts-plot-background")[0];
                  if (i === 2) {
                    elm.setAttribute("x", Number(el.getAttribute("width")) + 108);
                  }
                });
              }
          };


          const lastColumnRendering = (
            node,
            extraMargin
          ) => {
            let nodeElm = node && node.graphic && node.graphic.element;
            let dataLabelElm = node && node.dataLabels && node.dataLabels[0] && node.dataLabels[0].element;
            let xValue = nodeElm && nodeElm.getAttribute("x");
            if (nodeElm) {
              // nodeElm.setAttribute("rx", 8);
              nodeElm.setAttribute("x", Number(xValue) - 5);
              nodeElm.setAttribute("rx", 1000);
              nodeElm.setAttribute("ry", 40);
              // nodeElm.setAttribute("x", 0);
              // nodeElm.setAttribute(
              // 	"width",
              // 	35
              // );
            }

            dataLabelElm && dataLabelElm.childNodes.forEach(
              (elm) => {
                let width = 0;
                dataLabelElm.childNodes.forEach(
                  (elm) => {
                    if (elm.tagName == "rect") {
                      width = elm.getAttribute("width");
                    }
                  });

                if (elm.tagName == "text") {
                  elm.setAttribute("x", width);
                  elm && elm.childNodes.forEach((node, i) => {
                    if (i === 1) {
                      const textValue = node && node.textContent;
                      if (textValue && textValue.length > 10) {
                        node.textContent = `${textValue && textValue.substring(0, 10)}...`
                      }
                    }
                  })
                }
              }
            );
          };


          const firstColumnRendering = (
            node
          ) => {
            let nodeElm = node && node.graphic && node.graphic.element;
            let dataLabelElm = node && node.dataLabels && node.dataLabels[0] && node.dataLabels[0].element;
            // // const nodeHeight = nodeElm && nodeElm.getAttribute("height");
            if (nodeElm) {
              nodeElm.setAttribute("rx", 1000);
              nodeElm.setAttribute("ry", 40);
              nodeElm.setAttribute("x", 0);
              nodeElm.setAttribute("width", 35);
            }

            if (dataLabelElm) {
              dataLabelElm && dataLabelElm.childNodes && dataLabelElm.childNodes.length > 0 && dataLabelElm.childNodes.forEach(
                (elm) => {
                  if (elm && elm.tagName == "text") {
                    dataLabelElm.removeChild(elm);
                    // elm && elm.childNodes.forEach(
                    //   (tspan, i) => {
                    //     const textValue = tspan && tspan.textContent;
                    //     if(nodeHeight < 70) {
                    //       elm && elm.remove()
                    //     }
                    //     if (i == 0) {
                    //       tspan && tspan.setAttribute("class", "columnVal");
                    //       tspan && tspan.setAttribute("dy", 10);
                    //       tspan && tspan.setAttribute("x", -60);
                    //     }
                    //     if (i == 1) {
                    //       tspan && tspan.setAttribute("x", -120);
                    //       tspan && tspan.setAttribute("class", "columnName");
                    //       tspan && tspan.setAttribute("dy", 20);

                    //       //Logic to add ...(spread) after text.
                    //       if (textValue && textValue.length > 12) {
                    //         // const xValue = tspan && tspan.getAttribute("x");
                    //         tspan.textContent = `${textValue && textValue.substring(0, 11)}...`;
                    //         // tspan && tspan.setAttribute("x", Number(xValue) + 10);
                    //         // tspan && tspan.getcomputedtextlength();
                    //       }
                    //     }
                    //   }
                    // );
                  }
                }
              );
            }
          };

          const centerColumnRendering = (
            node
          ) => {
            const isLastNode = node.linksFrom.length === 0 ? true : false;
            let nodeElm = node && node.graphic && node.graphic.element;
            let dataLabelElm = node && node.dataLabels &&
              node.dataLabels[0] && node.dataLabels[0].element;
            if (node.name == "Approved" || node.name == "Approuvé") {
              let elmClassName = dataLabelElm && dataLabelElm.getAttribute("class");
              dataLabelElm && dataLabelElm.setAttribute("class", `${elmClassName} labelWrapper approved`);
              if (nodeElm && nodeElm.getAttribute("height") < 60) {
                dataLabelElm && dataLabelElm.setAttribute("class", `${elmClassName} approvedThin`);
              }
            }

            if (isLastNode) {
              nodeElm && nodeElm.setAttribute("rx", 8);
            }

            const nodeXValue = nodeElm && nodeElm.getAttribute("x");
            if (nodeElm) {
              nodeElm.setAttribute("width", 80);
              nodeElm.setAttribute("x", nodeXValue - 30);
            }
          };

          nodes && nodes.forEach((node) => {
            if (node && node.column > maxColumns) {
              maxColumns = node.column;
            }
          });

          // main controller
          nodes && nodes.forEach((node) => {
            if (node && node.isNode && node.column == 0) {
              firstColumnRendering(node);
            }

            if (node && node.isNode && node.column == 1) {
              if (maxColumns == 1) {
                lastColumnRendering(node, 10);
                _lastColumnRendering(node, 4);
              } else {
                centerColumnRendering(node);
              }
            }

            if (node && node.isNode && node.column == 2) {
              lastColumnRendering(node, 0);
              _lastColumnRendering(node, 3);
            }
          });

          // Keeping first Node for Center column's text y index as 0.
          nodes && nodes.filter(n => n["column"] == 1).forEach((node, i) => {
            if (i === 0) {
              let dataLabelElm = node && node.dataLabels &&
                node.dataLabels[0] && node.dataLabels[0].element;
              dataLabelElm && dataLabelElm.childNodes && dataLabelElm.childNodes.forEach(
                (elm) => {
                  if (elm.tagName == "text") {
                    elm.setAttribute("y", 8);
                  }
                }
              );
            }
          })
        },
      },
    },
    tooltip: {
      borderColor: "#dbdbdb",
      boxShadow:
        "3px 3px 11px -1px rgba(0,0,0,0.57)",
      borderRadius: 10,
      followPointer: false,
      formatter: function () {
        let totalSumTo = 0;
        let totalSumFrom = 0;
        this.point.linksTo &&
          this.point.linksTo.forEach((link) => {
            totalSumTo = totalSumTo + link["weight"];
          }
          );

        this.point.linksFrom && this.point.linksFrom.forEach(
          (link) => {
            totalSumFrom = totalSumFrom + link["weight"];
          }
        );

        const campaigns = this.point.linksTo && this.point.linksTo.map((link) => ({
          campaign: link && link["from"],
          value: link.weight,
          percentage: (link.weight / totalSumTo) * 100,
        })
        );

        const status = this.point.linksFrom && this.point.linksFrom
          .filter((l) => l.weight > 0)
          .map((link) => ({
            status: link && link["to"],
            value: link.weight,
            percentage: (link.weight / totalSumFrom) * 100
          }));

        if (this.point.isNode) {
          const campaignStatus = data && data["description"] && data["description"].filter(desc => desc["campaign"] == this.point.id)[0] && data["description"].filter(desc => desc["campaign"] == this.point.id)[0]["status"]
          let stringCampaigns = `<h4><b>${this.point.id} - ${this.point.sum}</b></h4><br/>`;
          let srtingStatus = "";
          let srtingStatusHead = `<h4><b>${this.point.id} - ${this.point.sum}</b></h4><br/>`;
          let srtingCampaignStatus = `<p><b>(${campaignStatus})</b></p> <br/>`

          campaigns && campaigns.forEach((cam) => {
            stringCampaigns =
              stringCampaigns +
              `<br />` +
              `${cam.percentage &&
                cam.percentage %
                1 === 0 ? cam.percentage
                : (cam.percentage &&
                  Number(
                    cam.percentage
                  ).toFixed(
                    1
                  )) ||
                0}
              % of ${cam.campaign
              } (<b>${cam.value
              }</b>)`;
          });
          status &&
            status.forEach((stat) => {
              srtingStatus =
                srtingStatus +
                `<br />` +
                `<b>
              ${stat.percentage &&
                  stat.percentage %
                  1 ===
                  0
                  ? stat.percentage
                  : (stat.percentage &&
                    Number(
                      stat.percentage
                    ).toFixed(
                      1
                    )) ||
                  0
                }%</b> are ${stat.status
                } (<b>${stat.value}</b>)`;
            });
          return this.point.column == 0
            ? `${srtingStatusHead} ${srtingCampaignStatus} ${srtingStatus}`
            : stringCampaigns;
        }
        const statusValueOfTotal = this
          .point.weight;
        const totalOfCampaign = this.point.fromNode.getSum();
        const statusPercent =
          (statusValueOfTotal /
            totalOfCampaign) *
          100;
        return `<b>
       ${statusPercent % 1 === 0
            ? statusPercent
            : statusPercent &&
            statusPercent.toFixed(1)
          }%</b> of ${this.point.from
          } are ${this.point.to
          } <b>(${statusValueOfTotal})</b>`;
      },
    },
    states: {
      hover: {
        brightness: -0.3,
      },
    },
    credits: {
      enabled: false,
    },
    colors: [
      "#B3B3B3",
      "#FAE951",
      "#264D88",
      "#68BBF1",
      "#FFA083",
      "#269BE7",
      "#3DB8B1",
      "#497E99",
    ],
    plotOptions: {
      sankey: {
        dataLabels: {
          // color: "black",
          // backgroundColor: "rgba(1,1,1,0.9)",
          borderRadius: 7,

          padding: 8,

          // style: {
          //     textTransform: 'uppercase'
          // },
          enabled: true,
          color: "#4C4C4C",
          // y: 1,

          align: "center",
          // crop: false,
          // overflow: "allow",
          // position: "left",
          style: {
            textOutline: 0,
          },
          nodeFormat: `
      <p class='dataLabelWrapper'>
        <p class='value'>{point.sum} </p>
         <p class='name'>{point.name} </p>
      </p>
    `,
        },
      },
      series: {
        events: {
          mouseOver: function (e) {
            //console.log(e);
          },
        },
      },
      area: {

      }
    },
    xAxis: {
      visible: false,
    },
    yAxis: {
      visible: false,
    },
    series: [
      {
        keys: ["from", "to", "weight"],
        data: data.mapping,
        nodes: [
          ...data && data.description && data.description.map((obj, i) => ({
            id: obj["campaign"],
            offset: i == 0 ? -20 : null
            //  offset: i == 0 ? -30  : i == 1 ? -10 : i == 2 ? 10
          })),
          {
           id: "ACH",
           offset: -20,
          },
          {
           id: "Check",
           offset: -15,
          },
          {
           id: "Virtual C",
           offset: -10,
          },
          {
           id: "Wire",
           offset: 10,
          },
          {
           id: "Cross Border",
           offset: 15,
          },
        ],
        type: "sankey",
        name: "",
      },
    ],
  }
};

export default Options;
