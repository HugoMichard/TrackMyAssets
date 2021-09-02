import React, { Component } from "react";
import APIService from "routers/apiservice";
import Select from 'react-select'

// reactstrap components
import {
  Input,
  FormGroup,
  Form,
  Row,
  Col,
  Button
} from "reactstrap";

class AssetForm extends Component {
    constructor(props) {
        super(props);
        const form = {
            name: "",
            ast_type: "stock",
            ticker: "",
            coin: "",
            cat_id: ""
        }
        const typeOptions = [
            { value: 'stock', label: 'Stock Asset' },
            { value: 'crypto', label: 'Cryptocurrency' }
        ]
        this.state = { form: form, categories: {}, selectedType: null, selectedCat: null, typeOptions: typeOptions }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        const categories = this.state.categories;
        const form = {
            name: nextProps.name,
            ast_type: nextProps.ast_type,
            cat_id: nextProps.cat_id,
            ticker: nextProps.ticker,
            coin: nextProps.coin,
            ast_id: nextProps.ast_id
        }
        const selectedType = form.ast_type === "stock" ? this.state.typeOptions[0] : this.state.typeOptions[1];
        var selectedCat = {}
        for(var i in categories){
            if(categories[i].value === form.cat_id){
                selectedCat = categories[i];
                break;
            }
        }
        this.setState({form: form, selectedType: selectedType, selectedCat: selectedCat})
    }
    componentDidMount() {
        APIService.searchCategory({}).then(res => { 
            const categories = res.data.categories.map(({
                cat_id: value,
                name: label,
                ...rest
              }) => ({
                value,
                label,
                ...rest
              }));
            this.setState({categories: categories });});
    }
    handleChange(property, event) {
        var { form, selectedType, selectedCat } = this.state;
        form[property] = property === "ast_type" || property === "cat_id" ? event.value : event.target.value;
        if(property === "ast_type") {
            selectedType = event
        }
        if(property === "cat_id") {
            selectedCat = event
        }
        this.setState({form: form, selectedCat: selectedCat, selectedType: selectedType});
    }
    
    handleSubmit(e){
        if(this.state.form.ast_id) {
            APIService.updateAsset(this.state.form).then(res => {
                if(res.status === 200) { window.location = "/assets" }
            });
        } else {
            APIService.createAsset(this.state.form).then(res => {
                if(res.status === 200) { window.location = "/assets" }
            });
        }
    }
    assetIdentifier() {
        if(this.state.form.ast_type !== "crypto") {
            return (
                <div>                            
                    <label>Ticker Code</label>
                    <Input
                        placeholder="Ticker"
                        type="text"
                        onChange={(evt) => this.handleChange("ticker", evt)}
                        value={this.state.form.ticker}
                    />
                </div>
            );
        } else {
            return (
                <div>                            
                    <label>Coin Code</label>
                    <Input
                        placeholder="Coin"
                        type="text"
                        onChange={(evt) => this.handleChange("coin", evt)}
                        value={this.state.form.coin}
                    />
                </div>
            );
        }
    }
    render() {
        let { typeOptions, selectedType, selectedCat, categories } = this.state
        let submitText = this.state.form.ast_id === undefined ? "Create" : "Update"; 
        return (
        <>
            <Form>
                <Row>
                    <Col md="6">
                        <FormGroup>
                            <label>Type</label>
                            <Select options={typeOptions} onChange={(evt) => this.handleChange("ast_type", evt)} value={selectedType}>
                            </Select>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            <label>Category</label>
                            <Select options={categories} onChange={(evt) => this.handleChange("cat_id", evt)} value={selectedCat}></Select>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md="6">
                        <FormGroup>
                            <label>Name</label>
                            <Input 
                                placeholder="Name" 
                                type="text" 
                                onChange={(evt) => this.handleChange("name", evt)}
                                value={this.state.form.name}
                            />
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            {this.assetIdentifier()}
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <div className="update ml-auto mr-auto">
                        <Button
                            className="btn-round"
                            color="primary"
                            onClick={this.handleSubmit}
                        >
                            {submitText}
                        </Button>
                    </div>
                </Row>
            </Form>
        </>
        );
    }
}

export default AssetForm;
