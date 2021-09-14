import React, { Component } from "react";
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

class CreateCategory extends Component {
    render() {
        return (
        <>
            <div className="content">
            <Row>
                <Col md="12">
                <Card>
                    <CardHeader>
                        <CardTitle tag="h4" className="no-margin-bottom">Create a Category</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <CategoryForm {...this.props}></CategoryForm>
                    </CardBody>
                </Card>
                </Col>
            </Row>
            </div>
        </>
        );
    }
}

export default CreateCategory;
