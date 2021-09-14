import React, { Component } from "react";
import APIService from "routers/apiservice";
import { SketchPicker } from 'react-color';
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

class PlatformForm extends Component {
    constructor(props) {
        super(props);
        const form = {
            name: "",
            color: "000000"
        }
        this.state = { form: form, redirect: false }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        const form = {
            name: nextProps.name,
            color: nextProps.color,
            plt_id: nextProps.plt_id
        }
        this.setState({form: form})
    }
    handleChange(property, event) {
        var form = this.state.form;
        form[property] = event.target.value;
        this.setState({form: form});
    }

    handleChangeColor = (color) => {
        var form = this.state.form
        form.color = color.hex
        this.setState({ form: form });
      };
    
    handleSubmit(e){
        if(this.state.form.plt_id) {
            APIService.updatePlatform(this.state.form).then(res => {
                this.props.displayNotification(this.props.notify, res.data.notif.text, res.data.notif.color);
                this.setState({redirect: res.status === 200});
            });
        } else {
            APIService.createPlatform(this.state.form).then(res => {
                this.props.displayNotification(this.props.notify, res.data.notif.text, res.data.notif.color);
                this.setState({redirect: res.status === 200});
            });
        }
    }
    render() {
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
                {this.state.redirect ? <Redirect to="/platforms"/> : ""}
            </Form>
        </>
        );
    }
}

export default PlatformForm;
