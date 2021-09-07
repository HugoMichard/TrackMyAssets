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


class DeleteAsset extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            ast_id: this.props.match.params.ast_id,
            asset: {},
            orders: []
        }
    this.handleDelete = this.handleDelete.bind(this);
    }
    componentDidMount() {
        APIService.getAsset(this.state.ast_id).then(res => { console.log(res.data); this.setState({ asset: res.data.asset });});
        APIService.getOrdersOfAsset(this.state.ast_id).then(res => { console.log(res.data.orders);this.setState({ orders: res.data.orders });});
    }
    handleDelete(){
        if(this.state.ast_id) {
            APIService.deleteAsset(this.state.ast_id).then(res => {
                if(res.status === 200) { window.location = "/assets" }
            });
        }
    }
    renderTableData() {
        return this.state.orders.map((ord, index) => {
            const { ord_id, execution_date, price, quantity, fees, plt_name, plt_color } = ord
            return (
                <tr key={index} onClick={() => window.location = "/orders/" + ord_id}>
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
                                    noSubmitButton={true}>
                                </AssetForm>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h4" className="no-margin-bottom">These Orders are associated with the Asset and will be deleted</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Table>
                                    <thead className="text-primary">
                                        <tr>
                                            <th>Execution Date</th>
                                            <th>Platform</th>
                                            <th>Quantity</th>
                                            <th>Price</th>
                                            <th>Fees</th>
                                            <th>Total Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.renderTableData()}
                                    </tbody>
                                </Table>
                                <Button                             
                                    className="btn-round justify-content-end no-margin-top"
                                    onClick={this.handleDelete}
                                    color="danger">
                                    Confirm Delete
                                </Button>
                                <Button                             
                                    className="btn-round justify-content-end no-margin-top"
                                    onClick={() => window.location = "/assets"}
                                    color="primary">
                                    Cancel
                                </Button>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
        );
    }
}

export default DeleteAsset;
