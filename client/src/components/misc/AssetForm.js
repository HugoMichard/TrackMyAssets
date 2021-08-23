import React, { Component } from "react";
import APIService from "routers/apiservice";
import { Link } from "react-router-dom";

// reactstrap components
import {
  Card,
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
            type: ""
        }
        this.state = { form: form }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(property, event) {
        var form = this.state.form;
        form[property] = event.target.value;
        this.setState({form: form});
    }
    
    handleSubmit(e){
        APIService.createAsset(this.state.form).then(res => {
            if(res.status === 200) { window.location = "/assets" }
        });
    }
    render() {
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
                                onChange={(evt) => this.handleChange("name", evt)}
                            />
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            <label>Type</label>
                            <Input
                                placeholder="Type"
                                type="text"
                                onChange={(evt) => this.handleChange("type", evt)}
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
                            Create
                        </Button>
                    </div>
                </Row>
            </Form>
        </>
        );
    }
}

export default AssetForm;
