import React, { Component } from "react";
import APIService from "routers/apiservice";
import { Redirect } from "react-router";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table
} from "reactstrap";


class ValidateUploadOrder extends Component {
    constructor(props) {
        super(props);
        this.state = { redirect: false, orders: [] }
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({isHidden: nextProps.isHidden, orders: nextProps.orders})
    }
    handleSubmit(e){
        e.preventDefault();
        APIService.validateUploadOrderCsv(this.state.orders).then(res => {
            this.props.displayNotification(this.props.notify, res.data.notif.text, res.data.notif.color);
            this.setState({redirect: res.status === 200});
        }).catch(err => this.props.displayNotification(this.props.notify, err.response.data.notif.text, err.response.data.notif.color));
    }
    renderTableData() {
        const { orders } = this.state
        if(orders) {
            return orders.map((ord, index) => {
                const { execution_date, price, quantity, fees, asset, is_valid, is_present } = ord
                const ord_type = quantity < 0 ? "Sell" : "Buy";
                return (
                    <tr key={index}>
                        <td className={!is_valid ? is_present ? "primarytext" : "redtext" : "greentext"}>
                            {
                                is_present ? <i className="nc-icon nc-refresh-69" />
                                : is_valid ? <i className="nc-icon nc-check-2" />
                                : <i className="nc-icon nc-simple-remove" />
                            }
                        </td>
                        <td>{execution_date}</td>
                        <td className={ord_type === "Sell" ? "redtext" : "greentext"}>
                            {ord_type}
                        </td>
                        <td>{asset.name}</td>
                        <td>{asset.code}</td>
                        <td style={{ color: asset.cat_color }}>
                            {asset.cat_name}
                        </td>
                        <td className={quantity < 0 ? "redtext" : "greentext"}>{Math.abs(quantity)}</td>
                        <td>{price}</td>
                        <td className={quantity < 0 ? "redtext" : "greentext"}>{Math.round(Math.abs(quantity * price + fees) * 100) / 100}</td>
                        <td>{fees}</td>
                        <td>
                            <i 
                                className="nc-icon nc-simple-remove" 
                                onClick={(e) => { 
                                    e.stopPropagation();
                                    orders.splice(index, 1);
                                    this.setState({ orders: orders });
                                }} />
                        </td>
                    </tr>
                )
            })
        }
    }
    render() {
        const { isHidden, redirect } = this.state
        return (
        <>
            <Card hidden={isHidden}>
                <CardHeader>
                    <CardTitle tag="h4">Validate Orders</CardTitle>
                </CardHeader>
                <CardBody>
                    <p>These orders have been found in your CSV and will be added. Please validate the orders are correct. Invalid and already existing orders will not be added</p>
                    <p>
                        <span className="greentext"><i className="nc-icon nc-check-2" /> Valid</span> <br />
                        <span className="primarytext"><i className="nc-icon nc-refresh-69" /> Already exists</span> <br />
                        <span className="redtext"><i className="nc-icon nc-simple-remove" /> Invalid</span> <br />
                    
                    </p>
                    <Table responsive>
                        <thead className="text-primary">
                            <tr>
                                <th>Valid</th>
                                <th>Execution Date</th>
                                <th>Type</th>
                                <th>Asset Name</th>
                                <th>Asset Code</th>
                                <th>Asset Category</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>Total Price</th>
                                <th>Fees</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderTableData()}
                        </tbody>
                    </Table>
                    <Button                             
                        className="btn-round justify-content-end no-margin-top"
                        onClick={this.handleSubmit}
                        color="success">
                        Validate
                    </Button>
                    <Button                             
                        className="btn-round justify-content-end no-margin-top"
                        onClick={() => window.location = "/app/orders"}
                        color="danger">
                        Cancel
                    </Button>
                </CardBody>
                {redirect ? <Redirect to="/app/orders"/> : ""}
            </Card>
        </>
        );
    }
}

export default ValidateUploadOrder;
