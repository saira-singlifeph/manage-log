import React from 'react';
import { Form, Select, Space, DatePicker, Button } from 'antd';
import { 
    PRIORITIES as levels, 
    SOURCES as sources,
} from '../../constant/constant';

const { RangePicker } = DatePicker;


const FilterOptions = (props) => {
    const selectStyle = { width: '120px' };
    return (
       <Space>
            <Form
                onFinish={props.handleQueries}
                layout='inline'
                initialValues={{
                    level: '',
                    source: '',
                    range: ''
                }}
            >
                <Form.Item label='Priority Level' name='level' required placeholder='Select Priority'>
                    <Select style={selectStyle} name='level'>
                        {levels.map((level) => <Select.Option key={level}>{level}</Select.Option>)}
                    </Select>  
                </Form.Item>
                <Form.Item label='Source' name='source' placeholder='Select Source'>
                    <Select style={selectStyle} name='source'>
                        {sources.map((source) => <Select.Option key={source}>{source}</Select.Option>)}
                    </Select> 
                </Form.Item>
                <Form.Item label='Date Range' name='range'>
                    <RangePicker format='YYYY-MM-DD' />
                </Form.Item>
                <Form.Item>
                    <Button type='primary' htmlType='submit'>Apply filters</Button>
                </Form.Item>
            </Form>
       </Space>
    )
}

export default FilterOptions;