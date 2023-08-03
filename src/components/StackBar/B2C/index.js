import React from "react";
import "./styles.scss";
import { Card, Grid, Box } from "@material-ui/core";
import { withTranslation } from "react-i18next";

class StackBar extends React.Component {
  state = {
    data: [
      {
        color: "#C1F1E6",
        label: "Enrolled",
        weight:
          this.props.weight && this.props.weight.enrolled
            ? this.props.weight.enrolled
            : 0,
      },
      {
        color: "#B2DFFF",
        label: "Pending",
        weight:
          this.props.weight && this.props.weight.pendingConsumer
            ? this.props.weight.pendingConsumer
            : 0,
      },
      {
        color: "#FFE0B2",
        label: "Expired",
        weight:
          this.props.weight && this.props.weight.expiredPayeeCount
            ? this.props.weight.expiredPayeeCount
            : 0,
      },
      {
        color: "#FDB6C3",
        label: "Unavailable for Payments",
        weight:
          this.props.weight && this.props.weight.paymentsUnavailableCount
            ? this.props.weight.paymentsUnavailableCount
            : 0,
      },
    ],
    totalWeight: this.props.weight ?
      ((this?.props?.weight?.enrolled || 0) + (this?.props?.weight?.pendingConsumer || 0) +
        (this?.props?.weight?.expiredPayeeCount || 0) +
        (this?.props?.weight?.paymentsUnavailableCount || 0)) : 0,
  };

  render() {
    const { heading, t } = this.props;
    // let totalWeight = 0;
    // this.data.forEach(obj => {
    //     totalWeight = totalWeight + obj.weight;
    // });

    const { data, totalWeight } = this.state;
    return (
      <span className="_tileWrap">
        <Card className="cardWrap" style={{ maxHeight: this.props.i18n.language === "fr" ? 148 : 132 }}>
          <div className="_content">
            <div className={"heading"}>{heading}</div>
            {totalWeight && totalWeight > 0 ? data.map((obj, i) => (
              <span className="tooltip">
                <span
                  className={"chip"}
                  style={{
                    width: `${(obj.weight / totalWeight) * 100}%`,
                    background: obj.color,
                  }}
                />
                <span class={i === data.length - 1 ? "showLeft tooltiptext" : "tooltiptext"}>
                  {t(`componentData.CSC.${obj.label}`)}
                </span>
              </span>
            )) : null}
            <div className="keyPoints">
              <Grid
                container
                spacing={1}
                justify={
                  this.props.i18n.language === "fr" ? "space-between" : null
                }
              >
                {data.map((obj) => (
                  <Grid md={3}>
                    <Box my={1}>
                      <span>
                        <span className="infoGroup">
                          <span
                            className="squareBox"
                            style={{ background: obj.color }}
                          ></span>
                          <span className="info">
                            <span className="text">
                              {t(`componentData.CSC.${obj.label}`)}
                            </span>
                            <span className="percentage">
                              {obj.weight.toString() && totalWeight && totalWeight > 0
                                ? `${obj.weight
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} (${(
                                    (obj.weight / totalWeight) *
                                    100
                                  ).toFixed(2)}%)`
                                : 0}
                            </span>
                          </span>
                        </span>
                      </span>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </div>
          </div>
        </Card>
      </span>
    );
  }
}

export default withTranslation()(StackBar);
