import React, { Component } from "react";
import APIService from "routers/apiservice";
import Select from 'react-select';
import Switch from "react-switch";
import { Redirect } from "react-router";

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
            execution_date: new Date().toISOString().slice(0, 10).replace('T', ' '),
            isBuy: true
        };
        const selectedAstData = {
            ast_type: "",
            cat_name: "",
            cat_color: "",
            code: ""
        }
        this.state = { redirect:false, form: form, selectedAst: null, selectedAstData: selectedAstData, selectedPlt: null }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeSwitch = this.handleChangeSwitch.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        const assets = this.state.assets;
        const platforms = this.state.platforms;
        const form = {
            ord_id: nextProps.ord_id,
            cat_id: nextProps.cat_id,
            price: nextProps.price,
            fees: nextProps.fees,
            quantity: Math.abs(nextProps.quantity),
            ast_id: nextProps.ast_id,
            plt_id: nextProps.plt_id,
            execution_date: nextProps.execution_date,
            isBuy: nextProps.isBuy
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
        var selectedPlt = {}
        for(var j in platforms){
            if(platforms[j].value === form.plt_id){
                selectedPlt = platforms[j];
                break;
            }
        }
        this.setState({form: form, selectedAst: selectedAst, selectedAstData: selectedAstData,  selectedPlt: selectedPlt})
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
            this.setState({ assets: assets });
        });

        APIService.searchPlatforms({}).then(res => { 
            const platforms = res.data.platforms.map(({
                plt_id: value,
                name: label,
                ...rest
              }) => ({
                value,
                label,
                ...rest
              }));
            this.setState({ platforms: platforms });
        });
    }
    handleChange(property, event) {
        var { form, selectedAst, selectedAstData, selectedPlt } = this.state;
        form[property] = property === "ast_id" || property === "plt_id" ? event.value : event.target.value;
        if(property === "ast_id") {
            selectedAst = event;
            selectedAstData = event;
        }
        if(property === "plt_id") {
            selectedPlt = event;
        }
        this.setState({form: form, selectedAst: selectedAst, selectedAstData: selectedAstData, selectedPlt: selectedPlt});
    }
    handleChangeSwitch(value) {
        var form = this.state.form;
        form.isBuy = value
        this.setState({form: form});
    }
    
    handleSubmit(e){
        if(this.state.form.ord_id) {
            APIService.updateOrder(this.state.form).then(res => {
                this.props.displayNotification(this.props.notify, res.data.notif.text, res.data.notif.color);
                this.setState({redirect: res.status === 200});
            });
        } else {
            APIService.createOrder(this.state.form).then(res => {
                this.props.displayNotification(this.props.notify, res.data.notif.text, res.data.notif.color);
                this.setState({redirect: res.status === 200});
            });
        }
    }
    render() {
        let { redirect, selectedAst, assets, selectedAstData, selectedPlt, platforms } = this.state
        let submitText = this.state.form.ord_id === undefined ? this.state.form.isBuy ? "Buy" : "Sell" : "Update";
        return (
        <>
            <Form>
                <Row>
                    <Col md="6">
                        <FormGroup>
                            <Switch 
                                checked={this.state.form.isBuy} 
                                onChange={this.handleChangeSwitch}
                                offColor="#FF0000"/>
                                <div 
                                    className={this.state.form.isBuy ? "greentext switch-label" : "redtext switch-label"}>
                                    {this.state.form.isBuy ? "Buy" : "Sell"}
                                </div>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            <label>Platform</label>
                            <Select options={platforms} onChange={(evt) => this.handleChange("plt_id", evt)} value={selectedPlt}></Select>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md="6">
                        <FormGroup>
                            <label>Asset</label>
                            <Select options={assets} onChange={(evt) => this.handleChange("ast_id", evt)} value={selectedAst}></Select>
                        </FormGroup>
                    </Col>
                    {this.state.selectedAstData.ast_type !== "fix" ?
                        <Col md="2">
                            <div>
                                <label>{this.state.selectedAstData.ast_type !== "crypto" ? "Ticker" : "Coin"}</label>
                                <p>{this.state.selectedAstData.code}</p>
                            </div>
                        </Col> :
                        <Col md="2">
                        <div>
                            <label>Fixed Value</label>
                            <p>{this.state.selectedAstData.fix_vl}</p>
                        </div>
                        </Col>
                    }
                    <Col md="2">
                            <label>Type</label>
                            <p>{selectedAstData.ast_type ? 
                                  selectedAstData.ast_type === "stock" ? "Stock Asset" 
                                : selectedAstData.ast_type === "crypto" ? "Cryptocurrency" 
                                : "Fixed Price Asset"
                                : ""}</p>
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
                {redirect ? <Redirect to="/orders"/> : ""}
            </Form>
        </>
        );
    }
}

export default OrderForm;
