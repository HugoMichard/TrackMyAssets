import React, { Component } from "react";
import APIService from "routers/apiservice";
import Select from 'react-select';

// reactstrap components
import {
  Input,
  FormGroup,
  Form,
  Row,
  Col,
  Button
} from "reactstrap";

import TextField from '@material-ui/core/TextField';


class OrderForm extends Component {
    constructor(props) {
        super(props);
        const form = {
            quantity: "",
            price: "",
            fees: "",
            execution_date: new Date().toISOString().slice(0, 10).replace('T', ' ')
        };
        const selectedAstData = {
            ast_type: "",
            cat_name: "",
            cat_color: "",
            code: ""
        } 
        this.state = { form: form, selectedAst: null, selectedAstData: selectedAstData }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        const assets = this.state.assets;
        const form = {
            ord_id: nextProps.ord_id,
            cat_id: nextProps.cat_id,
            price: nextProps.price,
            fees: nextProps.fees,
            quantity: nextProps.quantity,
            ast_id: nextProps.ast_id,
            execution_date: nextProps.execution_date
        }

        var selectedAst = {}
        var selectedAstData = {}
        for(var i in assets){
            if(assets[i].value === form.ast_id){
                selectedAst = assets[i];
                selectedAstData = assets[i];
                break;
            }
        }
        this.setState({form: form, selectedAst: selectedAst, selectedAstData: selectedAstData})
    }
    componentDidMount() {
        APIService.searchAssets({}).then(res => { 
            const assets = res.data.assets.map(({
                ast_id: value,
                name: label,
                ...rest
              }) => ({
                value,
                label,
                ...rest
              }));
            this.setState({assets: assets });
        });

    }
    handleChange(property, event) {
        var { form, selectedAst, selectedAstData } = this.state;
        form[property] = property === "ast_id" ? event.value : event.target.value;
        if(property === "ast_id") {
            selectedAst = event;
            selectedAstData = event;
        }
        this.setState({form: form, selectedAst: selectedAst, selectedAstData: selectedAstData});
    }
    
    handleSubmit(e){
        if(this.state.form.ord_id) {
            APIService.updateOrder(this.state.form).then(res => {
                if(res.status === 200) { window.location = "/orders" }
            });
        } else {
            APIService.createOrder(this.state.form).then(res => {
                if(res.status === 200) { window.location = "/orders" }
            });
        }
    }
    render() {
        let { selectedAst, assets, selectedAstData } = this.state
        let submitText = this.state.form.ord_id === undefined ? "Create" : "Update";
        return (
        <>
            <Form>
                <Row>
                    <Col md="6">
                    <FormGroup>
                            <label>Asset</label>
                            <Select options={assets} onChange={(evt) => this.handleChange("ast_id", evt)} value={selectedAst}></Select>
                        </FormGroup>
                    </Col>
                    <Col md="2">
                        <div>
                            <label>{this.state.selectedAstData.ast_type !== "crypto" ? "Ticker" : "Coin"}</label>
                            <p>{this.state.selectedAstData.code}</p>
                        </div>
                    </Col>
                    <Col md="2">
                            <label>Type</label>
                            <p>{selectedAstData.ast_type ? selectedAstData.ast_type === "stock" ? "Stock Asset" : "Cryptocurrency" : ""}</p>
                    </Col>
                    <Col md="2">
                            <label>Category</label>
                            <p style={{
                                color: selectedAstData.cat_color
                            }}>{selectedAstData.cat_name}</p>
                    </Col>
                </Row>
                <Row>
                    <Col md="4">
                    <FormGroup key={this.state.form.execution_date}>
                        <TextField
                            id="date"
                            label="Execution Date"
                            type="date"
                            defaultValue={this.state.form.execution_date}
                            onChange={(evt) => this.handleChange("execution_date", evt)}
                            InputLabelProps={{
                                shrink: true
                            }}
                        />                    
                    </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md="4">
                        <FormGroup>
                            <label>Quantity</label>
                            <Input 
                                placeholder="Quantity" 
                                type="text" 
                                onChange={(evt) => this.handleChange("quantity", evt)}
                                value={this.state.form.quantity}
                            />
                        </FormGroup>
                    </Col>
                    <Col md="4">
                        <FormGroup>
                            <label>Unit Price</label>
                            <Input 
                                placeholder="Price" 
                                type="text" 
                                onChange={(evt) => this.handleChange("price", evt)}
                                value={this.state.form.price}
                            />
                        </FormGroup>
                    </Col>
                    <Col md="4">
                        <FormGroup>
                            <label>Fees</label>
                            <Input 
                                placeholder="Fees" 
                                type="text" 
                                onChange={(evt) => this.handleChange("fees", evt)}
                                value={this.state.form.fees}
                            />
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

export default OrderForm;
