import React, { Component } from "react";
import APIService from "routers/apiservice";
import { SketchPicker } from 'react-color';

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
        this.state = { form: form }
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
        console.log(color);
        var form = this.state.form
        form.color = color.hex
        console.log(form)
        this.setState({ form: form });
      };
    
    handleSubmit(e){
        if(this.state.form.cat_id) {
            APIService.updateCategory(this.state.form).then(res => {
                if(res.status === 200) { window.location = "/categories" }
            });
        } else {
            APIService.createCategory(this.state.form).then(res => {
                if(res.status === 200) { window.location = "/categories" }
            });
        }
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
            </Form>
        </>
        );
    }
}

export default CategoryForm;
