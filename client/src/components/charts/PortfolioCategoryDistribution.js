import React, { Component } from "react";
import APIService from "routers/apiservice";

// reactstrap components
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle
} from "reactstrap";

import {
    PortfolioCategoryDistributionChart,
    PortfolioCategoryDistributionChartData
  } from "variables/charts/PortfolioCategoryDistributionChart";

class PortfolioCategoryDistribution extends Component {
    constructor(props) {
        super(props);
        this.state = {
            portfolioChartData: PortfolioCategoryDistributionChartData.data,
            portfolioChartKeys: PortfolioCategoryDistributionChartData.keys,
            portfolioChartColors: PortfolioCategoryDistributionChartData.colors
        }
        this.getPieColor = this.getPieColor.bind(this);
    }
    componentDidMount() {
      APIService.getPortfolioValueForeachCat().then(res => {
        const totalValue = res.data.values.map(v => v.value).reduce((a, b) => a + b);
 
        var colors = {}
        var keys = []
        var data = []
        res.data.values.forEach(v => {
          colors[v.cat_id] = v.color;
          keys.push(v.cat_id);
          data.push({
            id: v.cat_id,
            label: v.name,
            value: v.value / totalValue,
            tooltipValue: v.value
          });
        });
        this.setState({ portfolioChartData: data, portfolioChartKeys: keys, portfolioChartColors: colors });
      });
    }
    getPieColor(pie) {
      return this.state.portfolioChartColors[pie.id];
    }
    render() {
        return (
        <>
            <Card>
                <CardHeader>
                  <CardTitle tag="h5">Portfolio Distribution by Asset Category</CardTitle>
                </CardHeader>
                <CardBody style={ { height: 500 } }>
                  {PortfolioCategoryDistributionChart(this.state.portfolioChartData, this.state.portfolioChartKeys, this.getPieColor)}
                </CardBody>
            </Card>
        </>
        );
    }
}

export default PortfolioCategoryDistribution;
