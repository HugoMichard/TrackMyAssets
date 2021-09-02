import React, { Component } from "react";
import APIService from "routers/apiservice";
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

class DetailOrder extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            ord_id: this.props.match.params.ord_id,
            order: {} }
    }
    componentDidMount() {
        APIService.getOrder(this.state.ord_id).then(res => { this.setState({order: res.data.order });});
    }
    render() {
        return (
        <>
            <div className="content">
            <Row>
                <Col md="12">
                <Card>
                    <CardHeader>
                        <CardTitle tag="h4" className="no-margin-bottom">Order Details</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <OrderForm
                            ord_id={this.state.ord_id}
                            cat_id={this.state.order.cat_id}
                            price={this.state.order.price}
                            fees={this.state.order.fees}
                            quantity={this.state.order.quantity}
                            ast_id={this.state.order.ast_id}
                            execution_date={this.state.order.execution_date}>
                        </OrderForm>
                    </CardBody>
                </Card>
                </Col>
            </Row>
            </div>
        </>
        );
    }
}

export default DetailOrder;
