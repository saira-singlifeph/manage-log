import React from 'react';
import { Form, Input, Button, Select } from 'antd';
import { 
    PRIORITIES as levels,
    SOURCES as sources
} from '../../constant/constant';
const { TextArea } = Input;

const FormData = ({ 
    logDetails = null,
    isEdit, 
    onEdit, 
    handleLogUpdate, 
    isUpdating,
    createToggle,
    isInputReadyOnly,
    handleCreateLog,
    isCreating
}) => {

    let initialValues = {
        log_name: '',
        message: '',
        priority: '',
        source: ''
    }

    const onFinishEdit = async(values) => {
        await handleLogUpdate(values)
    };

    const onFinishCreate = async(values) => {
        await handleCreateLog(values)
    };

    const onFinish = isEdit ? onFinishEdit : onFinishCreate;

    const formItem = [
        {
            name: 'Log Name',
            key: 'log_name',
            rules: [{ required: true, message: 'Please add a Log name'}]
        },
        {
            name: 'Message',
            key: 'message',
            rules: [{ required: true, message: 'Please add a message'}]
        },
        {
            name: 'Priority',
            key: 'priority',
            rules: [{ required: true, message: 'Please select priority level'}],
            keys: levels
        },
        {
            name: 'Source',
            key: 'source',
            rules: [{ required: true, message: 'Please select source type'}],
            keys: sources
        }
    ].map(({ name, key, rules, keys })=>{
       return(
            <Form.Item label={name} name={key} rules={rules}>
                {   
                    ['source', 'priority'].includes(key) ? (
                        <Select required disabled={isInputReadyOnly}>
                            {keys.map((key) => <Select.Option id={key} key={key} value={key}>{key}</Select.Option>)}
                        </Select>
                    ) : key === 'message' ? <TextArea key={key} readOnly={isInputReadyOnly}/> : <Input key={key} readOnly={isInputReadyOnly} />
                }
            </Form.Item>
        )
    });


    if (logDetails) {
        initialValues = {
            id: logDetails.id,
            log_name: logDetails.log_name,
            message: logDetails.message,
            priority: logDetails.priority,
            source: logDetails.source
        }
    }
    
    const handleButtons = (isForEdit = false, withLogDetails = null) => {
        if (isForEdit && withLogDetails) {
          return (
            <>
                <Form.Item hidden id="id" name="id">
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="dashed" block htmlType="submit" loading={isUpdating}>
                        {isUpdating? "Saving..." : "Save"}
                    </Button>
                </Form.Item>
                <Form.Item>
                    <Button onClick={onEdit} type="primary" block disabled={isUpdating}>Cancel</Button>
                </Form.Item>
            </>           
          )
        } else if (!isForEdit && withLogDetails) {
           return (
                <Form.Item>
                    <Button type="default" block onClick={onEdit}>
                        Modify
                    </Button>
                </Form.Item>
           )
        }

        return (
          <>
              <Form.Item>
                <Button type="primary" htmlType='submit' block loading={isCreating}>
                    {isCreating? "Adding..." : "Add"}
                </Button>
            </Form.Item>
            <Form.Item>
                <Button type="default" block onClick={createToggle} disabled={isCreating}>
                    Cancel
                </Button>
            </Form.Item>
          </>
       )
    }

    return (
        <Form
            onFinish={onFinish}
            initialValues={initialValues}
            layout='vertical'
        >
            {formItem}
            {handleButtons(isEdit, logDetails)}     
        </Form>
    )
}

export default FormData;