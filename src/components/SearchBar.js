import React, { Component } from 'react'
import { Input, InputLabel } from '@material-ui/core';

class SearchBar extends Component {
    state = {
        search: '',
    }

    onChangeHandler = (e) => {
        this.setState({
            search: e.target.value
        }, () => {
            this.props.onFilter(this.state.search);
        })
    }

    render() {
        return (
            <form>
                <InputLabel>Search</InputLabel>
                <Input type="text" name="name" value={this.search} onChange={this.onChangeHandler} />
            </form>
        );
    }
}

export default SearchBar;
