import React, { Component } from "react";
import APIService from "routers/apiservice";
import CategoryForm from "components/forms/CategoryForm";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col
} from "reactstrap";

class DetailCategory extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            cat_id: this.props.match.params.cat_id,
            category: {} }
    }
    componentDidMount() {
        APIService.getCategory(this.state.cat_id).then(res => { this.setState({category: res.data.category });});
    }
    render() {
        return (
        <>
            <div className="content">
            <Row>
                <Col md="12">
                <Card>
                    <CardHeader>
                        <CardTitle tag="h4" className="no-margin-bottom">Category Details</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <CategoryForm
                            {...this.props}
                            name={this.state.category.name}
                            color={this.state.category.color}
                            cat_id={this.state.cat_id}>
                        </CategoryForm>
                    </CardBody>
                </Card>
                </Col>
            </Row>
            </div>
        </>
        );
    }
}

export default DetailCategory;
