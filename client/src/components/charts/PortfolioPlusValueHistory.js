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
    PortfolioPlusValueHistoryChart
  } from "variables/charts/PortfolioPlusValueHistoryChart";

class PortfolioPlusValueHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
                "x": new Date(v.date).toLocaleDateString(),
                "y": v.price
            }
          });
          this.setState({portfolioChartData: [{data: data, id: 'portfolio_plus_value'}] });
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
                {this.state.portfolioChartData ? 
                  <CardBody style={ { height: 500 } }>
                    {PortfolioPlusValueHistoryChart(this.state.portfolioChartData)}
                  </CardBody> : ""
                }
            </Card>
        </>
        );
    }
}

export default PortfolioPlusValueHistory;
