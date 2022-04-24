import React, { Component } from "react";

// reactstrap components
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle
} from "reactstrap";

import {
    PortfolioPlatformDistributionChart,
    PortfolioPlatformDistributionChartData
  } from "variables/charts/PortfolioPlatformDistributionChart";

class PortfolioCategoryDistribution extends Component {
    constructor(props) {
        super(props);
        this.state = {
            portfolioChartData: PortfolioPlatformDistributionChartData.data,
            portfolioChartKeys: PortfolioPlatformDistributionChartData.keys,
            portfolioChartColors: PortfolioPlatformDistributionChartData.colors
        }
        this.getPieColor = this.getPieColor.bind(this);
    }
    componentWillReceiveProps(nextProps) {
      const assetsInPlt = nextProps.assetsInPlatforms;
      if(assetsInPlt && assetsInPlt.length > 0) {
        const totalValue = assetsInPlt.map(v => v.value).reduce((a, b) => a + b);
        var colors = {}
        var keys = []
        var data = []
        assetsInPlt.forEach(v => {
          colors[v.plt_id] = v.color;
          keys.push(v.plt_id);
          data.push({
            id: v.plt_id,
            label: v.name,
            value: v.value / totalValue,
            tooltipValue: v.value
          });
        });
        this.setState({ portfolioChartData: data, portfolioChartKeys: keys, portfolioChartColors: colors });
      }
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
                  {PortfolioPlatformDistributionChart(this.state.portfolioChartData, this.state.portfolioChartKeys, this.getPieColor)}
                </CardBody>
            </Card>
        </>
        );
    }
}

export default PortfolioCategoryDistribution;
