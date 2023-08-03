const styles = (theme) =>({
    updatedTime:{
        color: "#828282",
        fontSize: 12,
        padding: "0 0 20px 0"
    },

    spendAnalysis:{
        float: "left",
        width: "100%",
        background: "#fff",
        padding: 20,
        color: 'rgba(0,0,0,0.87)',
        boxShadow: '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)',
        boxSizing: "border-box",
        borderRadius: "4px",
    },

    topFilterBox:{
        float: "left",
        width: "100%",
        borderBottom: '1px solid #9E9E9E',
        paddingBottom: 10,
        "& .leftFilter":{
            float: "left",
            "& h2":{
                color: 'rgba(18, 18, 18, 0.87)',
                fontSize: 16
            },
            "& h4":{
                color: '#9E9E9E',
                fontSize: 13,
                paddingTop: 5,
                fontWeight: '400',
                width: '400px', 
                lineHeight: '20px'
            },
            "& .MuiFormGroup-root label":{
                marginRight: 40,
                "& span":{
                    fontSize: 15
                }
            }            
        }
    },

    yearFilterBox:{
        float: 'right',
        "& .yearBox":{
            width: 130,
            float: 'left',
            marginRight: 5
        },
        "& .cumulativePopup":{
            float: 'left'
        }
    },

    coutrySeclectionBox:{
        "& .countryBox":{
            float: 'left',
            cursor: 'pointer',
            marginRight: 25,
            "& img": {
                float: 'left',
                border: "2px solid rgba(0,0,0,0)",
                borderRadius: '50%',                
            },
            "& h4": {
                float: 'left',
                color: "#7F7F7F",
                fontSize: 14,
                margin: '8px 0 0 10px',
                whiteSpace: 'nowrap', 
                width: '110px', 
                overflow: 'hidden',
                textOverflow: 'ellipsis',
            },
            "&[active='true']":{
                "& img":{
                    border: "2px solid #002D72",
                    boxShadow: '0 0 1px #002D72 inset'
                },
                "& h4":{
                    color: '#002D72',
                    fontWeight: "bold"
                }
            },
            "&:last-child":{
                marginRight: 0
            }
        }
    },

    grpahBox:{
        margin: '24px 0 0',
        "& .graphLeft":{
            borderRight: "1px solid #828282",            
            "& p":{
                color: "#828282",
                fontSize: 12,
                paddingBottom: 10
            },
            "& h3":{
                color: "#4C4C4C",
                fontSize: 14,
                paddingBottom: 10
            },
            "& h1":{
                color: "#000000",
                fontSize: 34,
                paddingBottom: 10
            },
            "& h4":{
                color: "#000000",
                fontSize: 21,
                paddingBottom: 6
            },
            "& h2":{                
                fontSize: 14,
                paddingBottom: 10,
                fontWeight: 'bold',
                "& svg":{
                    float: 'left',
                    margin: '-4px 0 0 0'
                },
                "&.green":{
                    color: "#219653",
                },
                "&.red":{
                    color: "#E03617",
                }
            },
            "& h5":{
                color: "#4C4C4C",
                fontStyle: 'italic',
                fontSize: 12,
                fontWeight: '400'
            },
            "& .spendList":{
                marginTop: 10,
                marginBottom: 5,  
                "& h3":{
                    cursor: 'pointer',
                    textDecoration: 'underline'
                }              
            }
        },

        "& .graphRight":{
            paddingLeft: 40,
            "& .trendForceBox":{
                float: "left",
                width: "100%",
                margin: "0 0 10px",
                "& > span":{
                    float: "left",
                    margin:"0 0 0 -9px"
                },
                "& label":{
                    float: "left",
                    margin: "10px 0 0 0",
                    color: "#4C4C4C",
                    fontSize: 15,
                    "& img":{
                        float: "left",
                        margin: "4px 6px 0 0"
                    }
                }
            },
            "& .averageSpent":{
                marginBottom: 28,
                "& h3":{
                    color: "#979797",
                    fontSize: 14,
                    "& span":{
                        paddingLeft: 8,
                        color: "#4C4C4C",
                        fontSize: 16,
                        fontWeight: 'bold'
                    }
                }
            }
        }
    },
    fullWidth:{
        float: 'left', 
        width: "100%"
    },

    payerRiskChartBox:{
        float: "left",
        width: "100%",
        background: "#fff",
        padding: 20,
        color: 'rgba(0,0,0,0.87)',
        boxShadow: '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)',
        boxSizing: "border-box",
        borderRadius: "4px",
    },

    tabContainer:{
        border: '1px solid #CCCCCC',
        padding: 5,
        borderRadius: 5
    },

    tab:{
        padding: '8px 30px',
        display: 'inline-block',
        cursor: 'pointer',
        borderRadius: 5,
        "& svg":{
            float: 'left',
            fontSize: 19,
            margin: '1px 10px 0 0'
        }
    },

    payeeEnrollBox:{
        float: "left",
        width: "100%",
        background: "#fff",
        padding: 20,
        color: 'rgba(0,0,0,0.87)',
        boxShadow: '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)',
        boxSizing: "border-box",
        borderRadius: "4px",
        position: 'relative',
        minHeight: 550
    },

    payeeEnrollHead:{
        float: 'right',
        "& .dropdownBox":{
            float: 'left',
            margin: '0 0 0 10px',            
        }
    },

    enrollMidSec:{
        float: 'left',
        width: '100%',
        "& .dateIcon":{
            padding: 1,
            margin: '0 -10px 0 0'
        },
        "& #dateRangeBox":{
            cursor: 'pointer'
        },
        "& .datePickerBox":{
            float: 'left',
            width: '98%', 
            left: '1%',             
            margin: '15px 0 0 0',
            background: '#fff',
            position: 'absolute',
            zIndex: '1', 
            boxSizing: 'border-box',
            border: '1px solid #999',
            padding: '8px',
            boxShadow: '1px 1px 5px #999',
            borderRadius: '7px',
            "& > ul":{
                float: 'left',
                width: '20%',
                listStyle: 'none',
                "& li":{
                    padding:'17px 15px',
                    textAlign: 'left',
                    backgroundColor: '#F2F2F2',
                    cursor: 'pointer',
                    margin: '0 0 10px',
                    fontSize: 14,
                    borderRadius: '4px',
                    "&:hover":{
                        background: '#008CE6',
                        color: '#fff'
                    },
                    "&.active":{
                        background: '#008CE6',
                        color: '#fff'
                    }
                }
            },
            
            "& .datePicker":{
                float: 'left',
                width: '76%',
                margin: '0 2% 0 2%',
                "& .react-datepicker":{
                    width: "100%",
                    border: 'none',
                    "& .react-datepicker__month-container":{
                        width: "50%"
                    },
                    "& .react-datepicker__month":{
                        margin: "10px 0"
                    },
                    "& .react-datepicker__day-name":{
                        padding: "6px 3.5% 2px",
                        background: "#F2F2F2",
                        margin:'10px 0 0',
                        width: 57
                    },
                    "& .react-datepicker__header":{
                        background: "#fff",
                        border: 'none'
                    },
                    "& .react-datepicker__navigation--previous":{
                        borderRightColor: '#4C4C4C',
                        "&.react-datepicker__navigation--previous--disabled":{
                            borderRightColor: '#ddd'
                        }
                    },
                    "& .react-datepicker__navigation--next":{
                        borderLeftColor: '#4C4C4C',
                        "&.react-datepicker__navigation--next--disabled":{
                            borderLeftColor: '#ddd'
                        }
                    }                    
                },
                "& .react-datepicker__day":{
                    margin: 0,
                    borderRadius: 0,
                    padding: '3px 3.5%',
                    fontSize: 14,
                    width: '57px',
                    "&:empty":{
                        visibility: 'hidden'
                    },
                    "&.react-datepicker__day--outside-month":{
                        color: "#cbcbcb"
                    }
                },
                "& .react-datepicker__day--in-range":{
                    background: '#F0F6FB',
                    color: '#4C4C4C',
                    "&:empty":{
                        visibility: 'hidden'
                    }
                },
                "& .react-datepicker__day--range-start":{
                    background: '#008CE6',
                    color: '#fff',
                    borderRadius: '8px 0 0 8px'
                },
                "& .react-datepicker__day--range-end":{
                    background: '#008CE6',
                    color: '#fff',
                    borderRadius: '0 8px 8px 0'
                }
            },
            "& .arrowUp":{
                position: 'absolute',
                top: '-36px',
                color: '#dcdcdc',
                "& svg":{
                    fontSize: 60
                }
            }
        },
        "& .selectedDate":{
            display: 'inline-block',
            margin: '11px 0 0 20px',
            color: '#9E9E9E',
            fontSize: 14
        },
        "& .DateBox":{
            float: 'left'
        }
    },

    timePeriodBox:{
        float: 'right',
        "& .MuiFormGroup-root":{
            flexDirection: 'row'
        }
    },

    payeeEnrollGraphBox:{
        float: 'left',
        width: '100%'
    },

    filterInfo:{
        float: 'left',
        width: '100%',
        margin: '24px 0 0',
        "& ul":{
            float: 'left',
            width: '100%',
            listStyle: 'none',
            "& li":{
                float: 'left',
                width: '50%',
                margin: '0 0 25px',
                "& h3":{
                    color: '#4C4C4C',
                    fontSize: '13px',
                    padding: "0 0 8px"
                },
                "& h2":{
                    color: '#000000',
                    fontSize: '16px',
                    "& label":{
                        fontSize: '12px',
                    }
                },
                "&.underline h3":{
                    textDecoration: 'underline',
                    cursor: 'pointer'
                }
            }
        }
    },

    payeeGraphArea:{
        float: 'left',
        width: '100%',
        boxSizing: 'border-box',
        padding: '0 0 0 20px'
    },

    customLegends:{
        float: 'left',
        width: '100%',
        textAlign: 'center',
        margin: '0 0 10px',
        "& ul":{
            float: 'left',
            width: '100%',
            "& li":{
                float: 'none',
                listStyle: 'none',
                display: 'inline-block',
                color: "#121212",
                fontSize: "13px",
                margin: "0 5px",    
                fontWeight: "300", 
                cursor: 'default',           
                "& label":{
                    width: '21px',
                    height: '11px',                    
                    background: '#979797',
                    float: 'left',
                    margin: '3px 5px 0 0',
                },
                "&.ActualSpent label":{
                    background: "#FFBBBB",
                    border: "1px solid #FFBBBB"
                },
                "&.LineOfRisk label":{
                    background: "#EB5757",
                    border: "1px dashed #fff"
                },
                "&.THLine label":{
                    background: "#2D9CDB",
                    border: "1px dashed #fff"
                }
            }
        }
    },

    highRiskTxt:{
        color: '#979797',
        fontSize: '13px',
        fontWeight: '300',
        float: 'left',
        width: '100%',
        padding: '0 0 8px 63px',
    },

    actualSpendTxt:{
        color: '#979797',
        fontSize: '13px',
        fontWeight: '300',
        float: 'left',
        width: '100%',
        padding: '0 0 8px 63px',
        margin: '-15px 0 0 0'
    },

    updatedTimeTxt:{
        float: 'left',
        width: '100%',
        color: "#828282",
        fontSize: 12,
        letterSpacing: '0.3px'
    },

    dateInputBox:{
        float: 'left',
        width: "98%",
        margin: "20px 0 15px",
        "& .MuiInputAdornment-marginDense":{
            display: 'none'
        }
    }
})

export default styles;