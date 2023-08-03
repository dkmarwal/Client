const styles = (theme) => ({
    gridItem: {
      margin: 0,
      '& .MuiOutlinedInput-notchedOutline': {
        '& legend': {
          fontSize: '0.85em',
        },
      },
      "& .MuiFormLabel-root":{
        fontSize: "15px"
      },
    },
    regParams: {
      fontWeight: 'bold',
      fontSize: '1rem',
      color: '#2B2D30',
      marginLeft: '8px',
    },
    regParamsBox: {
      margin: 'auto auto auto 8px',
      width: '100%',
    },
    imageUploadedName: {
      fontSize: '0.8rem',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      padding: '4px 0px',
      width: '85%',
    },
    customWidth: {
      maxWidth: 200,
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  });
  
  export default styles;
  