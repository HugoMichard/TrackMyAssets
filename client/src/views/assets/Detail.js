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
  Col
} from "reactstrap";

import {
    AssetHistoryChart,
    AssetHistoryChartData
  } from "variables/charts/AssetHistoryChart";

class DetailAsset extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            ast_id: this.props.match.params.ast_id,
            asset: {},
            histories: [],
            chart_data: [{
                "id": AssetHistoryChartData[0].id,
                "data": AssetHistoryChartData[0].data
            }]
        }
    }
    componentDidMount() {
        APIService.getAsset(this.state.ast_id).then(res => { this.setState({asset: res.data.asset });});
        APIService.getAssetHistory(this.state.ast_id).then(res => { 
            const data = res.data.histories.map(h => {
                return {
                    "x": new Date(h.hst_date).toLocaleDateString(),
                    "y": h.vl
                }
            });
            var chart_data = this.state.chart_data
            chart_data[0].data = data
            this.setState({histories: res.data.histories, chart_data: chart_data });
        });
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
                            code={this.state.asset.code}
                            ast_type={this.state.asset.ast_type}
                            ast_id={this.state.asset.ast_id}
                            cat_id={this.state.asset.cat_id}>
                        </AssetForm>
                    </CardBody>
                </Card>
                </Col>
            </Row>
            <Row>
                <Col>
                <Card>
                    <CardHeader>
                        <CardTitle tag="h4" className="no-margin-bottom">Asset History</CardTitle>
                    </CardHeader>
                    <CardBody style={ { height: 500 } }>
                        {AssetHistoryChart(this.state.chart_data)}
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
