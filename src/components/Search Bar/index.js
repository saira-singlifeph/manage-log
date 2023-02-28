import React from 'react';
import { Input, Space } from 'antd';

const { Search } = Input;

const SearchBar = (props) => {
    return (
        <Space>
            <Search 
                placeholder='Search log by name' 
                value={props.searchText}
                onSearch={props.handleSearchBar}
                style={{ width: 200 }} 
            />
        </Space>
    )
}

export default SearchBar;