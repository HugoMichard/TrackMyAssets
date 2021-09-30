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
    PortfolioPriceHistoryChart
  } from "variables/charts/PortfolioPriceHistoryChart";

class PortfolioPriceHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedPortfolioChartRange: "year",
            last_refresh: '1970-01-01'
        }
    }
    componentDidMount() {
        APIService.getUserLastRefresh().then(res => {
          this.setState({
            last_refresh: new Date().toISOString().slice(0, 10) === res.data.refresh_date ? "today" : res.data.refresh_date
          }) 
        })
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
          this.setState({portfolioChartData: [{data: data, id: 'portfolio_price'}] });
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
                {this.state.portfolioChartData ? 
                  <CardBody style={ { height: 500 } }>
                    {PortfolioPriceHistoryChart(this.state.portfolioChartData)}
                  </CardBody> : ""
                }
                <CardFooter>
                  <hr />
                  <div className="stats">
                    <i className="fa fa-history" /> Updated {this.state.last_refresh}
                  </div>
                </CardFooter>
            </Card>
        </>
        );
    }
}

export default PortfolioPriceHistory;
