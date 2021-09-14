import React, { Component } from "react";
import APIService from "routers/apiservice";
import AssetForm from "components/forms/AssetForm";
import OrdersOfAssetTable from "components/tables/OrdersOfAsset";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Button
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
            }],
            selectedPortfolioChartRange: "year",
            orderDates: []
        }
    }
    componentDidMount() {
        APIService.getAsset(this.state.ast_id).then(res => { this.setState({asset: res.data.asset }); });
        APIService.getBuyingQuantityOfAssetByDay(this.state.ast_id).then(res => { this.setState({orderDates: res.data.orders}); })
        this.updatePortfolioChartDataWithRange(this.state.selectedPortfolioChartRange);
    }
    handleClickPortfolioRange(value) {
        this.setState({selectedPortfolioChartRange: value});
        this.updatePortfolioChartDataWithRange(value)
    }
    updatePortfolioChartDataWithRange(range) {
        APIService.getAssetHistory({ast_id: this.state.ast_id, start_date: range}).then(res => { 
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
    renderPortfolioRangeButton(text, range, color) {
        return (
          <Button
            className={`justify-content-end no-margin-top ${this.state.selectedPortfolioChartRange === range ? "btn-square" : "btn-round"}`}
            color={color}
            onClick={() => this.handleClickPortfolioRange(range)}>
            {text}
          </Button>
        );
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
                            {...this.props}
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
                        {this.renderPortfolioRangeButton("Year", "year", "danger")}
                        {this.renderPortfolioRangeButton("Month", "month", "warning")}
                        {this.renderPortfolioRangeButton("Week", "week", "info")}
                        {this.renderPortfolioRangeButton("All", "all", "success")}
                    </CardHeader>
                    <CardBody style={ { height: 500 } }>
                        {AssetHistoryChart(this.state.chart_data, this.state.orderDates)}
                    </CardBody>
                </Card>
                </Col>
            </Row>
            <OrdersOfAssetTable
                title="Orders"
                displayDeleteButton={false}
                ast_id={this.state.ast_id}>
            </OrdersOfAssetTable>
            </div>
        </>
        );
    }
}

export default DetailAsset;
