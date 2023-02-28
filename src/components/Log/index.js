import React from 'react';
import { Drawer, Skeleton } from 'antd';
import FormData from '../Form/index';


const Log = (props) => {

    const form = (logDetails) => {
        return logDetails ? <FormData logDetails={logDetails} {...props}/> : ''; 
    };

    const content = props.loading && props.logDetail === null ? <Skeleton active/> : form(props.logDetails);

    return (
        <Drawer
            title='Log Details'
            placement='right'
            closable={false}
            onClose={props.onClose}
            open={props.isOpen}
            getContainer={false}
            >
            {content}
        </Drawer>
    )
}

export default Log;