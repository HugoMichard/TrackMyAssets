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

class IndexAssets extends Component {
    constructor(props) {
        super(props);
        const typeValueToLabel = {
            stock: "Stock Asset",
            crypto: "Cryptocurrency"
        }
        const searchForm = {
            name: ""
        }
        this.state = { 
            orders: [],
            searchForm: searchForm,
            typeValueToLabel: typeValueToLabel
        }
    }
    searchForOrders() {
        APIService.searchOrders(this.state.searchForm).then(res => { this.setState({ orders: res.data.orders }); });
    }
    componentDidMount() {
        this.searchForOrders()
    }
    renderTableData() {
        return this.state.orders.map((ord, index) => {
            const { ord_id, ast_name, cat_name, cat_color, ast_code, ast_type, quantity, fees, price, execution_date, plt_color, plt_name } = ord
            return (
                <tr key={index} onClick={() => window.location = "/orders/" + ord_id}>
                    <td>{execution_date}</td>
                    <td className={quantity < 0 ? "redtext" : "greentext"}>{quantity < 0 ? "Sell" : "Buy"}</td>
                    <td>{ast_name}</td>
                    <td>{ast_code}</td>
                    <td>{this.state.typeValueToLabel[ast_type]}</td>
                    <td style={{
                        color: cat_color
                        }}>{cat_name}
                    </td>
                    <td style={{
                        color: plt_color
                        }}>{plt_name}
                    </td>
                    <td className={quantity < 0 ? "redtext" : "greentext"}>{Math.abs(quantity)}</td>
                    <td>{price}</td>
                    <td>{fees}</td>
                    <td className={quantity < 0 ? "redtext" : "greentext"}>{Math.round(Math.abs(quantity * price + fees) * 10) / 10}</td>
                    <td>
                        <i 
                            className="nc-icon nc-simple-remove" 
                            onClick={(e) => { e.stopPropagation(); APIService.deleteOrder(ord_id).then(() => this.searchForOrders()); }} />
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
                    <Link to="/orders/create">
                        <Button
                            className="btn-round justify-content-end no-margin-top"
                            color="primary">
                                Create
                        </Button>
                    </Link>
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

export default IndexAssets;
