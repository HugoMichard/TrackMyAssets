import React, { Component } from "react";
import APIService from "routers/apiservice";
import Select from 'react-select';
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


class GenerateForm extends Component {
    constructor(props) {
        super(props);
        const form = {
            quantity: "",
            execution_date: new Date().toISOString().slice(0, 10).replace('T', ' ')
        };
        this.state = { redirect:false, form: form, selectedGtgAst: null, selectedAst: null, selectedPlt: null }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        const assets = this.state.assets;
        const platforms = this.state.platforms;
        const form = {
            ord_id: nextProps.ord_id,
            quantity: nextProps.quantity,
            price: nextProps.price,
            gtg_ast_id: nextProps.gtg_ast_id,
            ast_id: nextProps.ast_id,
            plt_id: nextProps.plt_id,
            execution_date: nextProps.execution_date
        }

        var selectedAst = {}
        var selectedGtgAst = {}
        for(var i in assets){
            if(assets[i].value === form.ast_id){
                selectedAst = assets[i];
            }
            if(assets[i].value === form.gtg_ast_id){
                selectedGtgAst = assets[i];
            }
        }

        var selectedPlt = {}
        for(var j in platforms){
            if(platforms[j].value === form.plt_id){
                selectedPlt = platforms[j];
                break;
            }
        }
        this.setState({form: form, selectedAst: selectedAst, selectedGtgAst: selectedGtgAst, selectedPlt: selectedPlt});
    }
    componentDidMount() {
        APIService.searchAssets({}).then(res => { 
            var assets = res.data.assets.map(({
                ast_id: value,
                name: label,
                ...rest
              }) => ({
                value,
                label,
                ...rest
              }));
            assets = assets.map(a => {
                a.code = a.ast_type === "crypto" ? a.code.slice(0, -a.duplicate_nbr.toString().length) : a.code;
                return a
            })
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
        var { form, selectedGtgAst, selectedAst, selectedPlt } = this.state;
        form[property] = property === "gtg_ast_id" || property === "ast_id" || property === "plt_id" ? event.value : event.target.value;
        if(property === "gtg_ast_id") {
            selectedGtgAst = event;
        }
        if(property === "ast_id") {
            selectedAst = event;
        }
        if(property === "plt_id") {
            selectedPlt = event;
        }
        this.setState({form: form, selectedAst: selectedAst, selectedGtgAst: selectedGtgAst, selectedPlt: selectedPlt});
    }
    handleSubmit(e){
        e.preventDefault();
        const updateOrCreateOrder = this.state.form.ord_id !== undefined ? APIService.updateOrder.bind(APIService) : APIService.createOrder.bind(APIService)

        updateOrCreateOrder(this.state.form).then(res => {
            this.props.displayNotification(this.props.notify, res.data.notif.text, res.data.notif.color);
            this.setState({redirect: res.status === 200});
        }).catch(err => this.props.displayNotification(this.props.notify, err.response.data.notif.text, err.response.data.notif.color));
    }
    render() {
        let { redirect, form, assets, selectedGtgAst, selectedAst, selectedPlt, platforms } = this.state
        return (
        <>
            <Form>
                <Row>
                    <Col md="4">
                        <FormGroup key={form.execution_date}>
                            <TextField
                                id="date"
                                label="Generation Date"
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
                    <Col md="6">
                        <FormGroup>
                            <label>Platform</label>
                            <Select options={platforms} onChange={(evt) => this.handleChange("plt_id", evt)} value={selectedPlt}></Select>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            <label>Generating Asset</label>
                            <Select options={assets} onChange={(evt) => this.handleChange("gtg_ast_id", evt)} value={selectedGtgAst}></Select>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md="6">
                        <FormGroup>
                            <label>Generated Asset</label>
                            <Select options={assets} onChange={(evt) => this.handleChange("ast_id", evt)} value={selectedAst}></Select>
                        </FormGroup>
                    </Col>
                    <Col md="3">
                        <FormGroup>
                            <label>Generated Quantity</label>
                            <Input 
                                placeholder="Quantity" 
                                type="text" 
                                onChange={(evt) => this.handleChange("quantity", evt)}
                                value={form.quantity}
                            />
                        </FormGroup>
                    </Col>
                    <Col md="3">
                        <FormGroup>
                            <label>Total price of generated assets (Optional)</label>
                            <Input 
                                placeholder="Price" 
                                type="text" 
                                onChange={(evt) => this.handleChange("price", evt)}
                                value={form.price}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <div className="update ml-auto mr-auto">
                        <Button
                            className="btn-round"
                            color="primary"
                            type="submit"
                            onClick={this.handleSubmit}
                        >
                            Generate
                        </Button>
                    </div>
                </Row>
                {redirect ? <Redirect to="/app/orders"/> : ""}
            </Form>
        </>
        );
    }
}

export default GenerateForm;
