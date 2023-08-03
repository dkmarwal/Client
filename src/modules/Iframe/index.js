import React, { Component } from 'react'
import { Box } from '@material-ui/core'
import './styles.scss'


class Iframe extends Component{
    render(){
        const { dataSettings }=this.props
        return(
            <Box paddingY={3} >
                {dataSettings && dataSettings.endpoint?<iframe src={dataSettings.endpoint} title="iframe"></iframe>:''}
            </Box>
        )
    }
}

export default Iframe
