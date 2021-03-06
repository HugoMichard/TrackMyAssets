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
          const investmentHistory = res.data.values.map(v => {
            return {
                "x": new Date(v.date).toLocaleDateString(),
                "y": v.cum_sum
            }
          });
          const plusValueHistory = res.data.values.map(v => {
            return {
                "x": new Date(v.date).toLocaleDateString(),
                "y": v.plus_value
            }
          });
          var plusValueHistoryDictionary = {} 
          plusValueHistory.forEach(v => {
            plusValueHistoryDictionary[v.x] = v.y
          });
          var total_values = [];
          investmentHistory.forEach(v => {
            const plus_value_that_day = v.x in plusValueHistoryDictionary ? plusValueHistoryDictionary[v.x] : 0;
            total_values.push(v.y + plus_value_that_day);
            total_values.push(v.y);
          })
          var portfolioChartData = {
            chart_data: [{
                id: "Investments",
                data: investmentHistory
              },
              {
                id: "Plus-Value",
                data: plusValueHistory
              }],
            cumulative_values: total_values
          }
          this.setState({portfolioChartData: portfolioChartData});
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
