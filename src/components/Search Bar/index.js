import React from 'react';
import { Input } from 'antd';

const { Search } = Input;

const SearchBar = () => {
    return <Search placeholder="Search log by name" style={{ width: 200 }} />
}

export default SearchBar;