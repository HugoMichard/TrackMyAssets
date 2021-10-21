import React, { Component } from "react";
import WireForm from "components/forms/WireForm";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col
} from "reactstrap";

class CreateWire extends Component {
    render() {
        return (
        <>
            <div className="content">
                <Row>
                    <Col md="12">
                    <Card>
                        <CardHeader>
                            <CardTitle tag="h4" className="no-margin-bottom">Create a Wire</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <WireForm {...this.props}></WireForm>
                        </CardBody>
                    </Card>
                    </Col>
                </Row>
            </div>
        </>
        );
    }
}

export default CreateWire;
