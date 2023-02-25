import React from 'react';
import { Form, Input, Button, Select } from 'antd';
import { PRIORITIES as levels } from '../../constant/constant';
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
        log_name: "",
        message: "",
        priority: "",
        source: ""
    }

    const attributeNames = 
    [
        {
            name: "Log Name",
            key: "log_name",
        },
        {
            name: "Message",
            key: "message",
        },
        {
            name: "Priority",
            key: "priority",
        },
        {
            name: "Source",
            key: "source",
        }
    ];

    const onFinishEdit = async(values) => {
        await handleLogUpdate(values)
    };

    const onFinishCreate = async(values) => {
        await handleCreateLog(values)
    };

    const onFinish = isEdit ? onFinishEdit : onFinishCreate;

    const formItem = attributeNames.map(({ name, key })=>{
       return(
            <Form.Item label={name} name={key}>
                {   
                    key === "priority" ? (
                        <Select required disabled={isInputReadyOnly}>
                            {levels.map((level) => <Select.Option id={level} value={level}>{level}</Select.Option>)}
                        </Select>
                    ) : key === "message" ? <TextArea required readOnly={isInputReadyOnly}/> : <Input required readOnly={isInputReadyOnly} />
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
        layout="vertical"
        >
            {formItem}
            {handleButtons(isEdit, logDetails)}     
        </Form>
    )
}

export default FormData;