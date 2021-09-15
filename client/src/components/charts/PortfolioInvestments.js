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
    PortfolioInvestmentsChart,
    PortfolioInvestmentsChartData
  } from "variables/charts/PortfolioInvestmentsChart";

class PortfolioInvestments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            portfolioChartData: PortfolioInvestmentsChartData.data,
            portfolioChartKeys: PortfolioInvestmentsChartData.keys,
            portfolioChartColors: PortfolioInvestmentsChartData.colors,
            selectedPortfolioChartRange: "daily"
        }
        this.getBarColor = this.getBarColor.bind(this);
    }
    componentDidMount() {
        this.updatePortfolioChartDataWithRange(this.state.selectedPortfolioChartRange);
    }
    handleClickPortfolioRange(value) {
        this.setState({selectedPortfolioChartRange: value});
        this.updatePortfolioChartDataWithRange(value)
    }
    updatePortfolioChartDataWithRange(range) {
        APIService.getInvestments({ group_date: range }).then(res => {
          const categories = res.data.values.map(item => item.cat_name).filter((value, index, self) => self.indexOf(value) === index);
          var data = []
          var colors = {}
          res.data.values.forEach(item => {
            const index = data.findIndex(x => x.execution_date === item.execution_date);
            const item_value = Math.round(item.investment * 100) / 100
            if(index === -1) {
              var toAdd = { execution_date: item.execution_date };
              toAdd[item.cat_name] = item_value;
              colors[item.cat_name] = item.cat_color;
              data.push(toAdd);
            } else {
              data[index][item.cat_name] = item_value;
              colors[item.cat_name] = item.cat_color;
            }
          });
          this.setState({ portfolioChartData: data, portfolioChartKeys: categories, portfolioChartColors: colors });
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
    getBarColor(bar) {
      return this.state.portfolioChartColors[bar.id];
    }
    render() {
        return (
        <>
            <Card>
                <CardHeader>
                  <CardTitle tag="h5">Portfolio Investments</CardTitle>
                  {this.renderPortfolioRangeButton("Daily", "daily", "info")}
                  {this.renderPortfolioRangeButton("Monthly", "monthly", "warning")}
                  {this.renderPortfolioRangeButton("Yearly", "yearly", "danger")}
                </CardHeader>
                <CardBody style={ { height: 500 } }>
                  {PortfolioInvestmentsChart(this.state.portfolioChartData, this.state.portfolioChartKeys, this.getBarColor)}
                </CardBody>
            </Card>
        </>
        );
    }
}

export default PortfolioInvestments;
