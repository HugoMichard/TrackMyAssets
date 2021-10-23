import React, { Component } from "react";
import APIService from "routers/apiservice";
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


class WalletForm extends Component {
    constructor(props) {
        super(props);
        const form = {
            address: ""
        };
        this.state = { redirect:false, form: form, selectedDex: null }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        const dexs = this.state.dexs;

        const form = {
            wlt_id: nextProps.wlt_id,
            address: nextProps.address,
            plt_id: nextProps.plt_id
        }

        var selectedDex = {}
        for(var j in dexs){
            if(dexs[j].value === form.plt_id){
                dexs = dexs[j];
                break;
            }
        }

        this.setState({form: form, selectedDex: selectedDex})
    }
    componentDidMount() {
        APIService.searchPlatformDexs({}).then(res => { 
            const dexs = res.data.dexs.map(({
                plt_id: value,
                name: label,
                ...rest
              }) => ({
                value,
                label,
                ...rest
              }));
            this.setState({ dexs: dexs });
        });
    }
    handleChange(property, event) {
        var { form, selectedDex } = this.state;
        form[property] = property === "plt_id" ? event.value : event.target.value;
        if(property === "plt_id") {
            selectedDex = event;
        }
        this.setState({form: form, selectedDex: selectedDex});
    }
    
    handleSubmit(e){
        if(this.state.form.wlt_id) {
            APIService.updateWallet(this.state.form).then(res => {
                this.props.displayNotification(this.props.notify, res.data.notif.text, res.data.notif.color);
                this.setState({redirect: res.status === 200});
            });
        } else {
            APIService.createWallet(this.state.form).then(res => {
                this.props.displayNotification(this.props.notify, res.data.notif.text, res.data.notif.color);
                this.setState({redirect: res.status === 200});
            });
        }
    }
    render() {
        let { redirect, selectedDex, dexs } = this.state
        let submitText = this.state.form.wlt_id === undefined ? "Create" : "Update";
        return (
        <>
            <Form>
                <Row>
                    <Col md="6">
                        <FormGroup>
                            <label>DEX Platform</label>
                            <Select options={dexs} onChange={(evt) => this.handleChange("plt_id", evt)} value={selectedDex}></Select>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            <label>Wallet Address</label>
                            <Input 
                                placeholder="Address" 
                                type="text" 
                                onChange={(evt) => this.handleChange("address", evt)}
                                value={this.state.form.address}
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
                {redirect ? <Redirect to="/dexs"/> : ""}
            </Form>
        </>
        );
    }
}

export default WalletForm;
