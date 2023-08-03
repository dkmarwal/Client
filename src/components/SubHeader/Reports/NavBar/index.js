import React, { Component, Fragment } from 'react';
import { Tabs, Tab, Box } from '@material-ui/core';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import './styles.scss';
import config from '~/config';

export default class NavBar extends Component {

    state = {
        leftMenu: [
            {
                "url": "reports",
                "name": "report",
                "items": [],
                "alias": "report",
                "isProtected": true
            },
        ]
    };

    isViewable(name, isProtected) {
        return true;
        /*if (isProtected) {
            const { claims } = this.props;
            let str = `${name && name.toLowerCase()}_view`;
            let isEnabled = claims && claims.includes(str);
            if (isEnabled) {
                return true
            }
            return false;
        } else {
            return true;
        }*/
    }

    render() {
        const { leftMenu } = this.state;
        const {alias} = this.props;
        let currentNavIndex = _.findIndex(leftMenu, item => item.alias == alias);
        currentNavIndex = (currentNavIndex == -1)?0: currentNavIndex;

        return (
            <Fragment>
                <div id="navbar">
                    {alias != "none" ? <Tabs 
                        value={currentNavIndex} 
                        textColor="#008CE6"
                        TabIndicatorProps={{
                            style: {
                                backgroundColor: "#008CE6",
                                color: "#008CE6",
                            }
                        }}
                    >
                        {leftMenu.map((navItem, index) => (
                            <span key={index}>
                                {this.isViewable(navItem.alias, navItem.isProtected) === true ?
                                    <Link to={`${config.baseName}/${navItem.url}`} key={index}>
                                        <Tab label={navItem.name} value={currentNavIndex} index={index}  selected={currentNavIndex==index? true: false}/>
                                    </Link> : null}
                            </span>
                        ))}
                    </Tabs>: <Box p={1}> </Box>}
                </div>
            </Fragment>
        )
    }
}