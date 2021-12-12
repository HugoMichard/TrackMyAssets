import React, { Component } from "react";
import APIService from "routers/apiservice";
import AssetForm from "components/forms/AssetForm";
import OrdersOfAssetTable from "components/tables/OrdersOfAsset";
import { Redirect } from "react-router";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col
} from "reactstrap";


class DeleteAsset extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            ast_id: this.props.match.params.ast_id,
            asset: {},
            orders: [],
            redirect: false
        }
    this.handleDelete = this.handleDelete.bind(this);
    }
    componentDidMount() {
        APIService.getAsset(this.state.ast_id).then(res => { this.setState({ asset: res.data.asset });});
        APIService.getOrdersOfAsset(this.state.ast_id).then(res => { this.setState({ orders: res.data.orders });});
    }
    handleDelete(){
        if(this.state.ast_id) {
            APIService.deleteAsset(this.state.ast_id).then(res => {
                this.props.displayNotification(this.props.notify, res.data.notif.text, res.data.notif.color);
                this.setState({redirect: res.status === 200});
            });
        }
    }
    renderTableData() {
        return this.state.orders.map((ord, index) => {
            const { ord_id, execution_date, price, quantity, fees, plt_name, plt_color } = ord
            return (
                <tr key={index} onClick={() => window.location = "/app/orders/" + ord_id}>
                    <td>{execution_date}</td>
                    <td style={{ color: plt_color }}>
                        {plt_name}
                    </td>
                    <td>{quantity}</td>
                    <td>{price}</td>
                    <td>{fees}</td>
                    <td>{(quantity * price) + fees}</td>
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
                                <CardTitle tag="h4" className="no-margin-bottom">Delete Asset</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <AssetForm
                                    name={this.state.asset.name}
                                    code={this.state.asset.code}
                                    ast_type={this.state.asset.ast_type}
                                    ast_id={this.state.asset.ast_id}
                                    cat_id={this.state.asset.cat_id}
                                    cmc_id={this.state.asset.cmc_id}
                                    plt_id={this.state.asset.plt_id}
                                    duplicate_nbr={this.state.asset.duplicate_nbr}
                                    noSubmitButton={true}>
                                </AssetForm>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <OrdersOfAssetTable
                    title="These Orders are associated with the Asset and will be deleted"
                    displayDeleteButton={true}
                    handleDelete={this.handleDelete}
                    ast_id={this.state.ast_id}>
                </OrdersOfAssetTable>
                {this.state.redirect ? <Redirect to="/app/assets"/> : ""}
            </div>
        </>
        );
    }
}

export default DeleteAsset;
