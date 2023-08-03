import React from 'react';
import {Box, Typography, withStyles} from "@material-ui/core";
import Red_Polygon from '~/assets/images/Red_Polygon.svg';
import Green_Polygon from '~/assets/images/Green_Polygon.svg';

const styles =(theme)=>({
    payeeDetailBox:{
        textAlign: "left",
        float: "left",
        width: "18%",
        "& h3":{
            color: "#4C4C4C",
            padding: "0 0 10px",
            fontSize: "12px",            
        },
        "& h1":{
            color: "#000000",
            fontSize: "24px",
            padding: "0 0 10px 5px"
        },
        "& h2":{
            "& img":{
                float: "left",
                margin: "3px 4px 0 0px",
            },
            "& span":{
                float: "left",
                fontSize: "14px",
                fontWeight: 'bold'
            }
        },
        "&:last-child":{
            width: "26%"
        }
    }
})

const PayeeDetail=(props)=>{
    const {data, classes} = props;
    return(
        <>
            {Boolean(data) && data.length > 0 && data.map((e)=>{
                var diffVal = Number(e.difference.replace(/,/g, ''));
                var screenDiffVal = Math.abs(diffVal);
                screenDiffVal = screenDiffVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                return(
                    <Box className={classes.payeeDetailBox}>
                        <Typography variant='h3'>{e.displayName}</Typography>
                        <Typography variant='h1'>{e.value}</Typography>

                        

                        {diffVal != 0 && (
                            <Typography 
                                variant='h2'
                                style={{color: diffVal > 0 
                                    ? "#7AB4A5" 
                                    : diffVal < 0 
                                        ? "#C86F75" 
                                        : null
                                    }}
                            >
                                {diffVal > 0 
                                    ? <img src={Green_Polygon} alt="" /> 
                                    : diffVal < 0 
                                        ? <img src={Red_Polygon} alt="" /> 
                                        : null
                                }
                                <span>{screenDiffVal}</span>
                            </Typography>
                        )}   

                    </Box>
                )
            })}            
        </>
    )
}

export default withStyles(styles)(PayeeDetail);