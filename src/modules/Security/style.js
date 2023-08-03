const Styles =()=> ({
    SecurityContainer:{       
        background: "#fff",
        padding: "25px",
        margin: "2% 3%", 
        width: "94%",
        borderRadius: "4px",
        boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.2)"
   },

   headingSec:{
       fontSize: "16px",
       lineHeight: "20px",
       "& h1":{
        fontSize: "18px",
        padding: "0 0 10px",
        float: "left",
        width: "100%",
        "& label":{
            float: "left",
            margin: "0 8px 0 0",
            fontSize: "22px"
        },
        "& span":{
            float: "left",
            margin: "3px 0 0"
        }
       }       
   },

   paraTxt:{
    padding: "0 0 15px 30px"
   },

   yesNoBox:{
        padding: "0 0 0 40px",
        boxSizing: "border-box",
       "& .MuiBox-root":{
        float: "left",
        width: "110px",
        borderRadius: "6px",        
       }       
   },

   IPTextSec:{
       float: "left",
       width: "100%",
       margin: "10px 0 0",
       boxSizing: "border-box",
       padding: "0 30px",
       "& .IPTextField":{
           width: "90%",
           margin: "0 0 15px",
           float: "left",
           "& input":{
               paddingRight: "45px"
           }
       },
       "& .deleteField":{
           float: "left",
           cursor: "pointer",
           margin: "15px 0 0 10px",
           zIndex: "9",
           position: "relative",
           "&[disabled]":{
               opacity: "0.3",
               pointerEvents: 'none' 
           } 
       }
   },

   addIPBtn:{
       float: "left",
       width: "100%",
       margin: "10px 0 15px",
       boxSizing: "border-box",
       padding: "0 30px",
       "& button":{
           borderWidth: "2px",
           borderColor: "#0B1941",
           "&:hover":{
                borderWidth: "2px",
           },
           "& SVG":{
               fontSize: "20px"
           }
       }
   },

   saveIPBtn:{
    float: "left",
    width: "100%",
    margin: "15px 0 20px",
    boxSizing: "border-box",
    padding: "0 30px",
    "& button":{
        padding: "7px 35px"
    }
   },   

})

export default Styles;