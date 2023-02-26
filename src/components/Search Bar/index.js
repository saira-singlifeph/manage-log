import React from 'react';
import { Input } from 'antd';

const { Search } = Input;

const SearchBar = (props) => {
    return <Search 
        placeholder="Search log by name" 
        value={props.searchText}
        onSearch={props.handleSearchBar}
        style={{ width: 200 }} 
    />
}

export default SearchBar;