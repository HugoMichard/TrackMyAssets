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

class CategoryForm extends Component {
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
            cat_id: nextProps.cat_id
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
        const updateOrCreateCategory = this.state.form.cat_id !== undefined ? APIService.updateCategory.bind(APIService) : APIService.createCategory.bind(APIService)

        updateOrCreateCategory(this.state.form).then(res => {
            this.props.displayNotification(this.props.notify, res.data.notif.text, res.data.notif.color);
            this.setState({redirect: res.status === 200});
        }).catch(err => this.props.displayNotification(this.props.notify, err.response.data.notif.text, err.response.data.notif.color));
    }
    render() {
        let submitText = this.state.form.cat_id === undefined ? "Create" : "Update"; 
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
                {this.state.redirect ? <Redirect to="/app/categories"/> : ""}
            </Form>
        </>
        );
    }
}

export default CategoryForm;
