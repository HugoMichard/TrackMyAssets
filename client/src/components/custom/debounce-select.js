import Select from 'react-select'

const { Component } = require("react");

const debounce = (callback, delay) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => callback(...args), delay);
    }
}


class DebounceSelect extends Component {
    constructor(props) {
        super(props);
        this.state = { searchText: "" };
    }

    debouncedAction = debounce(text => this.props.searchFunction(text), this.props.debounceTime)

    handleChange = e => {
        this.setState({ searchText: e });
        this.debouncedAction(e);
    }

    render() {
        return (
            <Select 
                options={this.props.options} 
                onChange={(evt) => this.props.handleChange(this.props.changeElementName, evt)}
                onInputChange={this.handleChange}
                value={this.props.selectedValue}>
            </Select>
        )
    }
}
export default DebounceSelect;
