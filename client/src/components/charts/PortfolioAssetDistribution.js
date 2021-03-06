import React, { Component } from "react";

// reactstrap components
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle
} from "reactstrap";

import {
    PortfolioAssetDistributionChart,
    PortfolioAssetDistributionChartData
  } from "variables/charts/PortfolioAssetDistributionChart";

class PortfolioAssetDistribution extends Component {
    constructor(props) {
        super(props);
        this.state = {
            portfolioChartData: PortfolioAssetDistributionChartData.data,
            portfolioChartKeys: PortfolioAssetDistributionChartData.keys
        }
    }
    componentWillReceiveProps(nextProps) {
      if(nextProps.assetsOwned && nextProps.assetsOwned.length > 0) {
          const totalValue = nextProps.assetsOwned.map(v => v.quantity * v.vl).reduce((a, b) => a + b);

          var keys = []
          var data = []
          nextProps.assetsOwned.forEach(v => {
            keys.push(v.ast_id);
            data.push({
              id: v.ast_id,
              label: v.ast_name,
              value: v.quantity * v.vl / totalValue,
              tooltipValue: v.quantity * v.vl
            });
          this.setState({ portfolioChartData: data, portfolioChartKeys: keys });
        });
      }
    }
    render() {
        return (
        <>
            <Card>
                <CardHeader>
                  <CardTitle tag="h5">Portfolio Distribution by Asset</CardTitle>
                </CardHeader>
                <CardBody style={ { height: 500 } }>
                  {PortfolioAssetDistributionChart(this.state.portfolioChartData, this.state.portfolioChartKeys)}
                </CardBody>
            </Card>
        </>
        );
    }
}

export default PortfolioAssetDistribution;
