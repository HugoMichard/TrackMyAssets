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
    PortfolioCumulativeInvestmentsChart,
    PortfolioCumulativeInvestmentsChartData
  } from "variables/charts/PortfolioCumulativeInvestmentsChart";

class PortfolioPriceHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            portfolioChartData: PortfolioCumulativeInvestmentsChartData,
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
        APIService.getCumulativeInvestmentsWithValue({ portfolio_start_date: range }).then(res => {
          const investmentHistory = res.data.investments.map(v => {
            return {
                "x": new Date(v.random_date).toLocaleDateString(),
                "y": v.cum_sum
            }
          });
          const plusValueHistory = res.data.value_history.map(v => {
            return {
                "x": new Date(v.random_date).toLocaleDateString(),
                "y": v.plus_value
            }
          });
          var portfolioChartData = [
            {
              id: "Investments",
              data: investmentHistory
            },
            {
              id: "Plus-Value",
              data: plusValueHistory
            }
          ]
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
                  <CardTitle tag="h5">Portfolio Cumulative Investments</CardTitle>
                  {this.renderPortfolioRangeButton("Year", "year", "danger")}
                  {this.renderPortfolioRangeButton("Month", "month", "warning")}
                  {this.renderPortfolioRangeButton("Week", "week", "info")}
                  {this.renderPortfolioRangeButton("All", "all", "success")}
                </CardHeader>
                <CardBody style={ { height: 500 } }>
                  {PortfolioCumulativeInvestmentsChart(this.state.portfolioChartData)}
                </CardBody>
            </Card>
        </>
        );
    }
}

export default PortfolioPriceHistory;