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
    PortfolioTypeDistributionChart,
    PortfolioTypeDistributionChartData
  } from "variables/charts/PortfolioTypeDistributionChart";

class PortfolioCategoryDistribution extends Component {
    constructor(props) {
        super(props);
        const typeValueToLabel = {
          stock: "Stock Asset",
          crypto: "Cryptocurrency"
      }
        this.state = {
            portfolioChartData: PortfolioTypeDistributionChartData.data,
            portfolioChartKeys: PortfolioTypeDistributionChartData.keys,
            typeValueToLabel: typeValueToLabel
        }
    }
    componentDidMount() {
      APIService.getPortfolioValueForeachType().then(res => {
        var keys = []
        var data = []
        res.data.values.forEach(v => {
          keys.push(this.state.typeValueToLabel[v.ast_type]);
          data.push({
            id: this.state.typeValueToLabel[v.ast_type],
            label: this.state.typeValueToLabel[v.ast_type],
            value: v.value
          });
        });
        this.setState({ portfolioChartData: data, portfolioChartKeys: keys });
      });
    }
    render() {
        return (
        <>
            <Card>
                <CardHeader>
                  <CardTitle tag="h5">Portfolio Distribution by Asset Type</CardTitle>
                </CardHeader>
                <CardBody style={ { height: 500 } }>
                  {PortfolioTypeDistributionChart(this.state.portfolioChartData, this.state.portfolioChartKeys)}
                </CardBody>
            </Card>
        </>
        );
    }
}

export default PortfolioCategoryDistribution;
