import React, { Component } from "react";
import APIService from "routers/apiservice";
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


class WireForm extends Component {
    constructor(props) {
        super(props);
        const form = {
            amount: "",
            execution_date: new Date().toISOString().slice(0, 10).replace('T', ' '),
            isIn: false,
            target: ""
        };
        this.state = { redirect:false, form: form }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeSwitch = this.handleChangeSwitch.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        const form = {
            wir_id: nextProps.wir_id,
            amount: Math.abs(nextProps.amount),
            execution_date: nextProps.execution_date,
            target: nextProps.target,
            isIn: nextProps.isIn
        }

        this.setState({form: form})
    }
    handleChange(property, event) {
        var { form } = this.state;
        form[property] = event.target.value;

        this.setState({form: form});
    }
    handleChangeSwitch(value) {
        var form = this.state.form;
        form.isIn = value
        this.setState({form: form});
    }
    
    handleSubmit(e){
        const updateOrCreatePlatform = this.state.form.wir_id !== undefined ? APIService.updateWire.bind(APIService) : APIService.createWire.bind(APIService)

        updateOrCreatePlatform(this.state.form).then(res => {
            this.props.displayNotification(this.props.notify, res.data.notif.text, res.data.notif.color);
            this.setState({redirect: res.status === 200});
        }).catch(err => this.props.displayNotification(this.props.notify, err.response.data.notif.text, err.response.data.notif.color));
    }
    render() {
        let submitText = this.state.form.wir_id === undefined ? this.state.form.isIn ? "Received" : "Sent" : "Update";
        return (
        <>
            <Form>
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
                            <Switch 
                                checked={this.state.form.isIn} 
                                onChange={this.handleChangeSwitch}
                                offColor="#FF0000"/>
                                <div 
                                    className={this.state.form.isIn ? "greentext switch-label" : "redtext switch-label"}>
                                    {this.state.form.isIn ? "Received" : "Sent"}
                                </div>
                        </FormGroup>
                    </Col>
                    <Col md="4">
                        <FormGroup>
                            <label>Amount</label>
                            <Input 
                                placeholder="Amount" 
                                type="text" 
                                onChange={(evt) => this.handleChange("amount", evt)}
                                value={this.state.form.amount}
                            />
                        </FormGroup>
                    </Col>
                    <Col md="4">
                        <FormGroup>
                            <label>Target</label>
                            <Input 
                                placeholder="Target" 
                                type="text" 
                                onChange={(evt) => this.handleChange("target", evt)}
                                value={this.state.form.target}
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
                {this.state.redirect ? <Redirect to="/app/wires"/> : ""}
            </Form>
        </>
        );
    }
}

export default WireForm;
