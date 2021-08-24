import React, { Component } from "react";
import APIService from "routers/apiservice";
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

class DetailAsset extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            ast_id: this.props.match.params.ast_id,
            asset: {} }
    }
    componentDidMount() {
        APIService.getAsset(this.state.ast_id).then(res => { this.setState({asset: res.data.asset });});
    }
    render() {
        return (
        <>
            <div className="content">
            <Row>
                <Col md="12">
                <Card>
                    <CardHeader>
                        <CardTitle tag="h4" className="no-margin-bottom">Asset Detail</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <AssetForm
                            name={this.state.asset.name}
                            coin={this.state.asset.coin}
                            isin={this.state.asset.isin}
                            type={this.state.asset.type}
                            ast_id={this.state.asset.ast_id}
                            cat_id={this.state.asset.cat_id}>
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

export default DetailAsset;
