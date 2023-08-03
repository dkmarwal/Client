import React from 'react';
import {
  Box,
  Typography, IconButton,
  CircularProgress
  } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles } from '@material-ui/styles';
import styles from './styles';
import {withTranslation} from 'react-i18next'
import {compose} from 'redux'

const ClientList = (props) => {
    const { classes, dataInfo, canUnshareClient= true, clientsList, selectedClients, handleRemoveClient,  updateProgress, t} = props;

    if(updateProgress){
        return <Box p={0} display="flex" width="100%" justifyContent="center" alignSelf="center"><CircularProgress color="primary" /></Box>
    }

    return(
        <Box className={classes.root} >
            <Box p={1} className={classes.header}>
                <Typography variant='body1' color="primary">
                    {t('client.label.clientsLinked')}
                </Typography>
            </Box>
            <Box p={1}>
            {clientsList && clientsList.filter(client=> selectedClients.indexOf(client.clientId) !== -1).map((client) => {
                return <Box display="flex" width="100%">
                    <Box  p={1} pl={4} flexGrow={1} display="flex" alignItems="center" justifyContent="flex-start">
                        <Typography variant='body1' color="primary">
                            {client.clientName}
                        </Typography>
                    </Box>
                    {canUnshareClient &&<Box p={0} width="30px" alignSelf="center">
                        <IconButton color="primary" component="span" onClick={() => handleRemoveClient(dataInfo, client.clientId)}>
                            <DeleteIcon color="primary" />
                        </IconButton>
                    </Box>
                    }
                </Box>
            })
            }
            </Box>
        </Box>
    );
}

export default compose(withTranslation('common'),withStyles(styles))(ClientList);
