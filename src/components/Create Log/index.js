import React from 'react';
import { Modal } from 'antd';
import Form from '../Form';

const CreateLog = (props) => {
    return (
        <Modal
        title='New Log'
        centered
        open={props.isCreateLog}
        footer={null}
        destroyOnClose={true}
        closable={false}
      >
        <Form 
            createToggle={props.openCreateLogModal} 
            handleCreateLog={props.handleCreateLog} 
            isCreating={props.isCreating}
        />
      </Modal>
    )
}

export default CreateLog;