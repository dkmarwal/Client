export const styles = (theme) => ({
    heading:{
      color:"#0B1941",
      background:"#CEE1F0",
      fontSize: "18px",
      padding: "10px 16px",
      borderRadius: "10px 10px 0 0"
    },

    enrollmentDetailBox:{
      background: "#fff",
      padding: "0",
      borderRadius: "10px",
      margin: "8px 32px",
      display: "inline-block",
      width: "92%",
      clear: "both"
    },

    innerBox:{
      padding: "0"
    },

    graphBox:{
      borderRight: "1px solid #e0e0e0",
      textAlign: "Center",
      padding: "20px 25px 15px 15px",
      margin: "20px 0",
      "&:last-child":{
        border: "none",
      },
      "& h2":{
        textAlign: "left",
        padding: "5px 0 0 15px",
        float: "left",
        width: "100%",
        "& span":{
          color: "#4C4C4C",
          fontSize: "20px",
          float: "left"
        },
        "& label":{
          padding: "0 0 0 20px",
          fontSize:"20px",
          color: "#000",
          float: "left" 
        }
      },
      "& h3":{
        padding: "5px 0 0 15px",
        float: "left",
        width: "100%",
        textAlign: "left",
        "& span":{
          color: "#4C4C4C",
          fontSize: "20px",     
        }
      }
    },

    chartOuterDiv:{
      padding: "35px 0 0",
      clear: "both",
      width: "50%",
      boxSizing: "border-box",
      margin: "0 25%"
    },

    chartOuterDiv2:{
      padding: "35px 15px 15px 15px",
      float: "left",
      width: "100%",
      boxSizing: "border-box",
      "& #legendHolder":{
        float: "left",
        width: "60%",
        textAlign: "left",
        "& ul":{
          float: "left",
          width: "100%",
          "& li":{
            float: "left",
            width: "100%",
            padding: "0 0 10px 0",
            cursor: "default",
            fontSize: "15px",
            "& span":{
              float: "left",
              height: 12,
              width: 12,
              borderRadius: "50%",
              margin: "4px 7px 0 0",
              fontSize: 14
            },
            "& label":{
              float: "left",
              fontWeight: "600",
            },
            "& h4":{
              float: "left",
              fontWeight: "400",
              width: "55%"
            },
            "&.strike":{
              "& h4":{
                textDecoration: "line-through"
              },
              "& label":{
                textDecoration: "line-through"
              }
            }
          }
        }
      },
      "& .doughnutChart_3":{
        float: "right",
        width: "40%"
      },
      "& #profileStatusLegend":{
        float: "left",
        width: "55%",
        textAlign: "left",
        "& ul":{
          float: "left",
          width: "100%",
          "& li":{
            float: "left",
            width: "100%",
            padding: "0 0 10px 0",
            cursor: "default",
            fontSize: "15px",
            "& span":{
              float: "left",
              height: 12,
              width: 12,
              borderRadius: "50%",
              margin: "4px 7px 0 0",
              fontSize: 14
            },
            "& label":{
              float: "left",
              fontWeight: "600",
            },
            "& h4":{
              float: "left",
              fontWeight: "400",
            },
            "&.strike":{
              "& h4":{
                textDecoration: "line-through"
              },
              "& label":{
                textDecoration: "line-through"
              }
            }
          }
        }
      },
      "& .doughnutChart_2":{
        float: "right",
        width: "45%",
        marginTop: 40,
      },
      "& #payeesLegend":{
        float: "left",
        width: "50%",
        textAlign: "left",
        margin: "20px 0 0",
        "& ul":{
          float: "left",
          width: "100%",
          "& li":{
            float: "left",
            width: "100%",
            padding: "0 0 10px 0",
            cursor: "default",
            fontSize: "15px",
            "& span":{
              float: "left",
              height: 12,
              width: 12,
              borderRadius: "50%",
              margin: "4px 7px 0 0",
              fontSize: 14
            },
            "& label":{
              float: "left",
              fontWeight: "600",
            },
            "& h4":{
              float: "left",
              fontWeight: "400",
              width: "50%"   
            },
            "&.strike":{
              "& h4":{
                textDecoration: "line-through"
              },
              "& label":{
                textDecoration: "line-through"
              }
            }
          }
        }
      },
      "& .doughnutChart_1":{
        float: "right",
        width: "40%",
        margin: "0 0 20px",
      },
    },

    graphBox2:{
      borderRight: "1px solid #e0e0e0",
      textAlign: "Center",
      padding: "20px 15px 15px",
      margin: "20px 0",
      "& h2":{
        textAlign: "left",
        padding: "4px 0 0 30px",
        "& span":{
          color: "#4C4C4C",
          fontSize: "18px",
          margin: "0 20px 0 0",
          padding: "0 0 2px"
        },
        "& label":{
          color: "#000",
          fontSize: "16px",
          cursor: "pointer",
          textDecoration: "underline"
        }
      }
    },

    captionTxt:{
      float: "left",
      width: "80%",
      padding: "10px 20px",
      background: "rgba(142,184,234,0.1)",
      borderRadius: "50px",
      lineHeight: "20px",
      fontSize: "15px",
      margin: "20px 10% 0"
    },

    dividerDiv:{
      borderBottom: '1px solid rgb(224, 224, 224)',
      float: 'left',
      width: '96%',
      margin: '0 2%',
    }

  });
