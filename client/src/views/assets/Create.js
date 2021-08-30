import React, { Component } from "react";
import AssetForm from "components/misc/AssetForm";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col
} from "reactstrap";

class CreateAsset extends Component {
    render() {
        return (
        <>
            <div className="content">
            <Row>
                <Col md="12">
                <Card>
                    <CardHeader>
                        <CardTitle tag="h4" className="no-margin-bottom">Create an Asset</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <AssetForm>
                        </AssetForm>
                    </CardBody>
                </Card>
                </Col>
            </Row>
            </div>
        </>
        );
    }
}

export default CreateAsset;
