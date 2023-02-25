import React from 'react';
import { Form, Select } from 'antd';
import { PRIORITIES as levels } from '../../constant/constant';

const FilterOptions = (props) => {
    return (
        <Form>
            <Form.Item>
                <Select defaultValue="All priorities" value={props.queryPriority} onChange={(e)=> props.handleQueries({ level: e })}>
                    <Select.Option id="all" value={null} >All priorities</Select.Option>
                        {levels.map((level) => <Select.Option id={level} value={level}>{level}</Select.Option>)}
                    </Select>   
            </Form.Item>
        </Form>
    )
}

export default FilterOptions;