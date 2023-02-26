import React from 'react';
import { Select } from 'antd';
import { SOURCES as sources } from '../../constant/constant';

const Priorities = () => {
    return (
        <Select style={{ width: "120px" }} value="">
            <Select.Option id="source">All sources</Select.Option>
            {sources.map((source) => <Select.Option key={source}>{source}</Select.Option>)}
        </Select> 
    )
}

export default Priorities;