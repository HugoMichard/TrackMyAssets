import React, { Component } from "react";
import APIService from "routers/apiservice";

// reactstrap components
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Button
} from "reactstrap";

import {
    PortfolioPlusValueHistoryChart,
    PortfolioPlusValueHistoryChartData
  } from "variables/charts/PortfolioPlusValueHistoryChart";

class PortfolioPlusValueHistory extends Component {
    constructor(props) {
        super(props);
        const portfolioChartData = [{
          "id": PortfolioPlusValueHistoryChartData[0].id,
          "data": PortfolioPlusValueHistoryChartData[0].data
        }]
        this.state = {
            portfolioChartData: portfolioChartData,
            selectedPortfolioChartRange: "year"
        }
    }
    componentDidMount() {
        this.updatePortfolioChartDataWithRange(this.state.selectedPortfolioChartRange);
    }
    handleClickPortfolioRange(value) {
        this.setState({selectedPortfolioChartRange: value});
        this.updatePortfolioChartDataWithRange(value)
    }
    updatePortfolioChartDataWithRange(range) {
        APIService.getPortfolioPlusValueHistory({ portfolio_chart_start_date: range }).then(res => {
          const data = res.data.values.map(v => {
            return {
                "x": new Date(v.random_date).toLocaleDateString(),
                "y": v.plus_value
            }
          });
          var portfolioChartData = this.state.portfolioChartData
          portfolioChartData[0].data = data
          this.setState({portfolioChartData: portfolioChartData });
        })
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
            <Card>
                <CardHeader>
                  <CardTitle tag="h5">Portfolio Plus Value Evolution</CardTitle>
                  {this.renderPortfolioRangeButton("Year", "year", "danger")}
                  {this.renderPortfolioRangeButton("Month", "month", "warning")}
                  {this.renderPortfolioRangeButton("Week", "week", "info")}
                  {this.renderPortfolioRangeButton("All", "all", "success")}
                </CardHeader>
                <CardBody style={ { height: 500 } }>
                  {PortfolioPlusValueHistoryChart(this.state.portfolioChartData)}
                </CardBody>
            </Card>
        </>
        );
    }
}

export default PortfolioPlusValueHistory;
