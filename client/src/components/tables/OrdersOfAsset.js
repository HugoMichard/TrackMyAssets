import React, { Component } from "react";
import APIService from "routers/apiservice";
import AssetForm from "components/forms/AssetForm";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Button,
  Table
} from "reactstrap";


class OrdersOfAssetTable extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            orders: []
        }
    }
    componentDidMount() {
        APIService.getOrdersOfAsset(this.props.ast_id).then(res => { this.setState({ orders: res.data.orders });});
    }
    renderTableData() {
        return this.state.orders.map((ord, index) => {
            const { ord_id, execution_date, price, quantity, fees, plt_name, plt_color } = ord
            return (
                <tr key={index} onClick={() => window.location = "/orders/" + ord_id}>
                    <td>{execution_date}</td>
                    <td className={quantity < 0 ? "redtext" : "greentext"}>{quantity < 0 ? "Sell" : "Buy"}</td>
                    <td style={{ color: plt_color }}>
                        {plt_name}
                    </td>
                    <td className={quantity < 0 ? "redtext" : "greentext"}>{Math.abs(quantity)}</td>
                    <td>{price}</td>
                    <td>{fees}</td>
                    <td className={quantity < 0 ? "redtext" : "greentext"}>{Math.abs(quantity * price + fees)}</td>
                </tr>
            )
        })
    }
    render() {
        return (
        <>
            <div className="content">
                <Row>
                    <Col md="12">
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h4" className="no-margin-bottom">{this.props.title}</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Table responsive>
                                    <thead className="text-primary">
                                        <tr>
                                            <th>Execution Date</th>
                                            <th>Type</th>
                                            <th>Platform</th>
                                            <th>Quantity</th>
                                            <th>Unit Price</th>
                                            <th>Fees</th>
                                            <th>Total Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.renderTableData()}
                                    </tbody>
                                </Table>
                                {this.props.displayDeleteButton ? <div>
                                    <Button                             
                                        className="btn-round justify-content-end no-margin-top"
                                        onClick={this.props.handleDelete}
                                        color="danger">
                                        Confirm Delete
                                    </Button>
                                    <Button                             
                                        className="btn-round justify-content-end no-margin-top"
                                        onClick={() => window.location = "/assets"}
                                        color="primary">
                                        Cancel
                                    </Button> </div>: <div></div>
                                }
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
        );
    }
}

export default OrdersOfAssetTable;
