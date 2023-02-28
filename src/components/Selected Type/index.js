import React from 'react';
import { Select, Form, Button } from 'antd';

const SelectedType = (props) => { 
    const { 
        options = [], 
        label,
        type = '',
        btnLabel = '',
    } = props;
    return (
      <Form
        initialValues={{
            selectedItem: '',
        }}
        onFinish={props.onFinish}
      >
        <Form.Item label={label} key={type} name={type}>
            <Select style={{ width: '120px' }} name={type}>
                {options.map((option) => <Select.Option key={option}>{option}</Select.Option>)}
            </Select> 
        </Form.Item>
        <Form.Item>
            <Button htmlType='submit' type='primary' block>{btnLabel}</Button>
        </Form.Item>
      </Form>
    )
}

export default SelectedType;