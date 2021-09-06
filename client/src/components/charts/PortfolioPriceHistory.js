import React, { Component } from "react";
import APIService from "routers/apiservice";

// reactstrap components
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  CardTitle,
  Button
} from "reactstrap";

import {
    PortfolioPriceHistoryChart,
    PortfolioPriceHistoryChartData
  } from "variables/charts/PortfolioPriceHistoryChart";

class PortfolioPriceHistory extends Component {
    constructor(props) {
        super(props);
        const portfolioChartData = [{
          "id": PortfolioPriceHistoryChartData[0].id,
          "data": PortfolioPriceHistoryChartData[0].data
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
        APIService.getPortfolioValueHistory({ portfolio_chart_start_date: range }).then(res => {
          const data = res.data.values.map(v => {
            return {
                "x": new Date(v.random_date).toLocaleDateString(),
                "y": v.value
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
                  <CardTitle tag="h5">Portfolio Value Evolution</CardTitle>
                  {this.renderPortfolioRangeButton("Year", "year", "danger")}
                  {this.renderPortfolioRangeButton("Month", "month", "warning")}
                  {this.renderPortfolioRangeButton("Week", "week", "info")}
                  {this.renderPortfolioRangeButton("All", "all", "success")}
                </CardHeader>
                <CardBody style={ { height: 500 } }>
                  {PortfolioPriceHistoryChart(this.state.portfolioChartData)}
                </CardBody>
                <CardFooter>
                  <hr />
                  <div className="stats">
                    <i className="fa fa-history" /> Updated 3 minutes ago
                  </div>
                </CardFooter>
            </Card>
        </>
        );
    }
}

export default PortfolioPriceHistory;