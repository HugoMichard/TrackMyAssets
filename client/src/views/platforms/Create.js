import React, { Component } from "react";
import PlatformForm from "components/forms/PlatformForm";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col
} from "reactstrap";

class CreatePlatform extends Component {
    render() {
        return (
        <>
            <div className="content">
            <Row>
                <Col md="12">
                <Card>
                    <CardHeader>
                        <CardTitle tag="h4" className="no-margin-bottom">Add a Platform</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <PlatformForm></PlatformForm>
                    </CardBody>
                </Card>
                </Col>
            </Row>
            </div>
        </>
        );
    }
}

export default CreatePlatform;
