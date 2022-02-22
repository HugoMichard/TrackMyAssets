import React, { Component } from "react";
import APIService from "routers/apiservice";

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
        this.getOrdersOfAsset = this.getOrdersOfAsset.bind(this)
    }
    componentDidMount() {
        this.getOrdersOfAsset();
    }
    getOrdersOfAsset() {
        APIService.getOrdersOfAsset(this.props.ast_id).then(res => { this.setState({ orders: res.data.orders });});
    }
    renderTableData() {
        return this.state.orders.map((ord, index) => {
            const { ord_id, execution_date, price, quantity, fees, plt_name, plt_color, gtg_ast_id } = ord
            const ord_type = !gtg_ast_id ? quantity < 0 ? "Sell" : "Buy" : Number(gtg_ast_id) === Number(this.props.ast_id) ? "Generates" : "Generated";
            return (
                <tr key={index} onClick={() => window.location = "/app/orders/" + ord_id}>
                    <td>{execution_date}</td>
                    <td className={ord_type === "Sell" ? "redtext" : ord_type === "Buy" ? "greentext" : ""}>
                        {ord_type}
                    </td>
                    <td style={{ color: plt_color }}>
                        {plt_name}
                    </td>
                    <td className={quantity < 0 ? "redtext" : "greentext"}>{Math.abs(quantity)}</td>
                    <td>{price}</td>
                    <td>{fees}</td>
                    <td className={quantity < 0 ? "redtext" : "greentext"}>{Math.round(Math.abs(quantity * price + fees) * 100) / 100}</td>
                    <td>
                        <i 
                            className="nc-icon nc-simple-remove" 
                            onClick={(e) => { 
                                e.stopPropagation(); 
                                APIService.deleteOrder(ord_id).then(res => {
                                    this.getOrdersOfAsset();
                                    this.props.displayNotification(this.props.notify, res.data.notif.text, res.data.notif.color);
                                }).catch(err => this.props.displayNotification(this.props.notify, err.response.data.notif.text, err.response.data.notif.color));
                            }} />
                    </td>
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
                                            <th>Delete</th>
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
                                        onClick={() => window.location = "/app/assets"}
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
