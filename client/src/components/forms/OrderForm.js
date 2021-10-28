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
        this.setState({form: form, selectedAst: selectedAst, selectedAstData: selectedAstData,  selectedPlt: selectedPlt}, () => this.handlePlatformChange(form.plt_id));
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
            this.setState({ assets: assets, availableAssets: assets });
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
        this.setState({form: form, selectedAst: selectedAst, selectedAstData: selectedAstData, selectedPlt: selectedPlt}, () => this.handlePlatformChange(event.value));
    }
    handlePlatformChange(plt_id) {
        const { platforms, form, assets } = this.state;
        const selectedPlatform = platforms.find(p => p.value === plt_id);
        if(selectedPlatform && selectedPlatform.dex_name) {
            form.quantity = 0.86;
            const availableAssets = assets.filter(a => a.plt_id === plt_id)
            this.setState({form: form, availableAssets: availableAssets});
        } else {
            this.setState({availableAssets: assets});
        }
    }
    handleChangeSwitch(value) {
        var form = this.state.form;
        form.isBuy = value
        this.setState({form: form});
    }
    
    handleSubmit(e){
        const updateOrCreateOrder = this.state.form.ord_id !== undefined ? APIService.updateOrder.bind(APIService) : APIService.createOrder.bind(APIService)

        updateOrCreateOrder(this.state.form).then(res => {
            this.props.displayNotification(this.props.notify, res.data.notif.text, res.data.notif.color);
            this.setState({redirect: res.status === 200});
        }).catch(err => this.props.displayNotification(this.props.notify, err.response.data.notif.text, err.response.data.notif.color));
    }
    render() {
        let { redirect, form, selectedAst, availableAssets, selectedAstData, selectedPlt, platforms } = this.state
        let submitText = form.ord_id === undefined ? form.isBuy ? "Buy" : "Sell" : "Update";
        return (
        <>
            <Form>
                <Row>
                    <Col md="6">
                        <FormGroup>
                            <Switch 
                                checked={form.isBuy} 
                                onChange={this.handleChangeSwitch}
                                offColor="#FF0000"/>
                                <div 
                                    className={form.isBuy ? "greentext switch-label" : "redtext switch-label"}>
                                    {form.isBuy ? "Buy" : "Sell"}
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
                            <Select options={availableAssets} onChange={(evt) => this.handleChange("ast_id", evt)} value={selectedAst}></Select>
                        </FormGroup>
                    </Col>
                    {selectedAstData.ast_type === "crypto" || selectedAstData.ast_type === "stock" ?
                        <Col md="2">
                            <div>
                                <label>{selectedAstData.ast_type !== "crypto" ? "Ticker" : "Coin"}</label>
                                <p>{selectedAstData.code}</p>
                            </div>
                        </Col> :
                        selectedAstData.ast_type === "fix" ?
                            <Col md="2">
                                <div>
                                    <label>Fixed Value</label>
                                    <p>{selectedAstData.fix_vl}</p>
                                </div>
                            </Col> : ""
                    }
                    {selectedAstData.ast_type !== "dex" ?
                        <Col md="2">
                                <label>Type</label>
                                <p>{selectedAstData.ast_type ? 
                                    selectedAstData.ast_type === "stock" ? "Stock Asset" 
                                    : selectedAstData.ast_type === "crypto" ? "Cryptocurrency" 
                                    : "Fixed Price Asset"
                                    : ""}</p>
                        </Col> : ""
                    }
                    {selectedAstData.ast_type !== "dex" ?
                        <Col md="2">
                                <label>Category</label>
                                <p style={{
                                    color: selectedAstData.cat_color
                                }}>{selectedAstData.cat_name}</p>
                        </Col> : ""
                    }
                </Row>
                <Row>
                    <Col md="4">
                        <FormGroup key={form.execution_date}>
                            <TextField
                                id="date"
                                label="Execution Date"
                                type="date"
                                defaultValue={form.execution_date}
                                onChange={(evt) => this.handleChange("execution_date", evt)}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />                    
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    {selectedAstData.ast_type !== "dex" ?
                        <Col md="4">
                            <FormGroup>
                                <label>Quantity</label>
                                <Input 
                                    placeholder="Quantity" 
                                    type="text" 
                                    onChange={(evt) => this.handleChange("quantity", evt)}
                                    value={form.quantity}
                                />
                            </FormGroup>
                        </Col> : ""
                    }
                    <Col md="4">
                        <FormGroup>
                            <label>{selectedAstData.ast_type !== "dex" ? "Unit Price" : "Price"}</label>
                            <Input 
                                placeholder="Price" 
                                type="text" 
                                onChange={(evt) => this.handleChange("price", evt)}
                                value={form.price}
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
                                value={form.fees}
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
