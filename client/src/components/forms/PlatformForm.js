import React, { Component } from "react";
import APIService from "routers/apiservice";
import { SketchPicker } from 'react-color';
import { Redirect } from "react-router";
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

class PlatformForm extends Component {
    constructor(props) {
        super(props);
        const form = {
            name: "",
            color: "000000",
            wallet_address: ""
        }
        this.state = { form: form, redirect: false, selectedDex: null }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        const dexs = this.state.dexs;
        const form = {
            name: nextProps.name,
            color: nextProps.color,
            plt_id: nextProps.plt_id,
            dex_id: nextProps.dex_id,
            wallet_address: nextProps.wallet_address
        }

        var selectedDex = {}
        for(var j in dexs){
            if(dexs[j].value === form.dex_id){
                selectedDex = dexs[j];
                break;
            }
        }

        this.setState({form: form, selectedDex: selectedDex})
    }
    componentDidMount() {
        APIService.searchDexs().then(res => {
            let dexs = res.data.dexs.map(({
                dex_id: value,
                name: label,
                ...rest
              }) => ({
                value,
                label,
                ...rest
              }));
            dexs.unshift({value: null, label: 'Not a DEX'});
            this.setState({ dexs: dexs });
        });
    }

    handleChange(property, event) {
        var { form, selectedDex } = this.state;
        form[property] = property === "dex_id" ? event.value : event.target.value;
        if(property === "dex_id") {
            selectedDex = event;
        }
        this.setState({form: form, selectedDex: selectedDex});
    }

    handleChangeColor = (color) => {
        var form = this.state.form
        form.color = color.hex
        this.setState({ form: form });
    }
    
    handleSubmit(e){
        const updateOrCreatePlatform = this.state.form.plt_id !== undefined ? APIService.updatePlatform.bind(APIService) : APIService.createPlatform.bind(APIService)

        updateOrCreatePlatform(this.state.form).then(res => {
            this.props.displayNotification(this.props.notify, res.data.notif.text, res.data.notif.color);
            this.setState({redirect: res.status === 200});
        }).catch(err => this.props.displayNotification(this.props.notify, err.response.data.notif.text, err.response.data.notif.color));
    }
    render() {
        let { redirect, selectedDex, dexs } = this.state
        let submitText = this.state.form.plt_id === undefined ? "Create" : "Update"; 
        return (
        <>
            <Form>
                <Row>
                    <Col md="6">
                        <FormGroup>
                            <label>Name</label>
                            <Input 
                                placeholder="Name" 
                                type="text"
                                value={this.state.form.name}
                                onChange={(evt) => this.handleChange("name", evt)}
                            />
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            <label>Color</label>
                                <SketchPicker 
                                color={this.state.form.color}
                                onChange={ this.handleChangeColor }></SketchPicker>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md="6">
                        <FormGroup>
                            <label>Link platform to DEX</label>
                            <Select options={dexs} onChange={(evt) => this.handleChange("dex_id", evt)} value={selectedDex}></Select>
                        </FormGroup>
                    </Col>
                    {this.state.form.dex_id ?
                        <Col md="6">
                            <FormGroup>
                                <label>Wallet Address on DEX</label>
                                <Input 
                                    placeholder="Wallet Address" 
                                    type="text"
                                    value={this.state.form.wallet_address}
                                    onChange={(evt) => this.handleChange("wallet_address", evt)}
                                />
                            </FormGroup>
                        </Col>
                    : ""}
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
                {redirect ? <Redirect to="/platforms"/> : ""}
            </Form>
        </>
        );
    }
}

export default PlatformForm;
