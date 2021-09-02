import React, { Component } from "react";
import OrderForm from "components/forms/OrderForm";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col
} from "reactstrap";

class CreateOrder extends Component {
    render() {
        return (
        <>
            <div className="content">
            <Row>
                <Col md="12">
                <Card>
                    <CardHeader>
                        <CardTitle tag="h4" className="no-margin-bottom">Create an Order</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <OrderForm></OrderForm>
                    </CardBody>
                </Card>
                </Col>
            </Row>
            </div>
        </>
        );
    }
}

export default CreateOrder;
