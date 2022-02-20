import React, { Component } from "react";
import APIService from "routers/apiservice";
import { Link } from "react-router-dom";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Button
} from "reactstrap";

import DebounceSearch from "components/custom/search"

class IndexOrders extends Component {
    constructor(props) {
        super(props);
        const typeValueToLabel = {
            stock: "Stock Asset",
            crypto: "Cryptocurrency",
            fix: "Fixed Price",
            dex: "DEX"
        }
        this.state = { 
            orders: [],
            typeValueToLabel: typeValueToLabel
        }
        this.searchForOrders = this.searchForOrders.bind(this)
    }
    searchForOrders(searchName) {
        APIService.searchOrders({name: searchName}).then(res => { this.setState({ orders: res.data.orders });});
    }
    componentDidMount() {
        this.searchForOrders("")
    }
    renderTableData() {
        return this.state.orders.map((ord, index) => {
            const { ord_id, ast_name, cat_name, cat_color, ast_code, gtg_ast_id, ast_type, quantity, fees, price, execution_date, plt_color, plt_name, ast_duplicate_nbr } = ord
            const ord_type = !gtg_ast_id ? quantity < 0 ? "Sell" : "Buy" : "Generate"
            return (
                <tr key={index} onClick={() => window.location = "/app/orders/" + ord_id}>
                    <td>{execution_date}</td>
                    <td className={ord_type === "Sell" ? "redtext" : ord_type === "Buy" ? "greentext" : ""}>
                        {ord_type}
                    </td>
                    <td>{ast_name}</td>
                    <td>{ast_type === "stock" ? ast_code : ast_type === "crypto" ? ast_code.slice(0, -ast_duplicate_nbr.toString().length) : ""}</td>
                    <td>{this.state.typeValueToLabel[ast_type]}</td>
                    <td style={{
                        color: cat_color
                        }}>{cat_name}
                    </td>
                    <td style={{
                        color: plt_color
                        }}>{plt_name}
                    </td>
                    <td className={quantity < 0 ? "redtext" : "greentext"}>{Math.round(Math.abs(quantity) * 100) / 100}</td>
                    <td>{price}</td>
                    <td>{fees}</td>
                    <td className={quantity < 0 ? "redtext" : "greentext"}>{Math.round(Math.abs(quantity * price + fees) * 10) / 10}</td>
                    <td>
                        <i 
                            className="nc-icon nc-simple-remove" 
                            onClick={(e) => { 
                                e.stopPropagation(); 
                                APIService.deleteOrder(ord_id).then(res => {
                                    this.searchForOrders();
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
                        <CardTitle tag="h4" className="no-margin-bottom">Orders</CardTitle>
                    </CardHeader>
                    <CardBody>
                    <Link to="/app/orders/create">
                        <Button
                            className="btn-round justify-content-end no-margin-top"
                            color="primary">
                                Buy / Sell
                        </Button>
                    </Link>
                    <Link to="/app/orders/generate">
                        <Button
                            className="btn-round justify-content-end no-margin-top"
                            color="secondary">
                                Generate
                        </Button>
                    </Link>
                    <DebounceSearch searchFunction={this.searchForOrders.bind(this)}/>
                    <Table responsive>
                        <thead className="text-primary">
                        <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Asset</th>
                            <th>Ticker / Coin</th>
                            <th>Type</th>
                            <th>Category</th>
                            <th>Platform</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Fees</th>
                            <th>Total</th>
                            <th>Delete</th>
                        </tr>
                        </thead>
                        <tbody>
                            {this.renderTableData()}
                        </tbody>
                    </Table>
                    </CardBody>
                </Card>
                </Col>
            </Row>
            </div>
        </>
        );
    }
}

export default IndexOrders;
