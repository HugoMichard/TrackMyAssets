const { Component } = require("react");
const { Input, InputGroupAddon, InputGroup, InputGroupText } = require("reactstrap");

const debounce = (callback, delay) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => callback(...args), delay);
    }
}


class DebounceSearch extends Component {
    constructor(props) {
        super(props);
        this.state = { searchText: "" };
    }

    debouncedAction = debounce(text => this.props.searchFunction(text), 500)

    handleChange = e => {
        this.setState({ searchText: e.target.value });
        this.debouncedAction(e.target.value);
    }

    render() {
        return (
            <form>
                <InputGroup className="no-border max-width-200">
                    <InputGroupAddon addonType="append">
                        <InputGroupText>
                            <i className="nc-icon nc-zoom-split" />
                        </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder="Search"                 
                        type="text"
                        onChange={this.handleChange}
                        value={this.state.searchText}/>
                </InputGroup>
            </form>
        )
    }
}
export default DebounceSearch;
