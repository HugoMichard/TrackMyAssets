import React, { Component } from "react";
import GenerateForm from "components/forms/GenerateForm";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col
} from "reactstrap";

class GenerateOrder extends Component {
    render() {
        return (
        <>
            <div className="content">
            <Row>
                <Col md="12">
                <Card>
                    <CardHeader>
                        <CardTitle tag="h4" className="no-margin-bottom">Add Token Generation</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <GenerateForm {...this.props}></GenerateForm>
                    </CardBody>
                </Card>
                </Col>
            </Row>
            </div>
        </>
        );
    }
}

export default GenerateOrder;
