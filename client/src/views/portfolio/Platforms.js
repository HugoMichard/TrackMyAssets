import React, { Component } from "react";

import APIService from "routers/apiservice";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Table
} from "reactstrap";
import PortfolioPlatformDistribution from "components/charts/PortfolioPlatformDistribution";

class PlatformsPortfolio extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      platforms : [],
      assetsInPlatforms: {},
      userPltIds: []
    }
  }
  componentDidMount() {
    APIService.searchPlatforms({}).then(res => {
      this.setState({platforms: res.data.platforms});
    })

    APIService.getUserAssetsInEachPlt().then(res => {
      this.setState({assetsInPlatforms: res.data.assetsByPlt, userPltIds: res.data.platformIds}); 
    })
  }
  renderTableData(astData) {
    if(astData) {
      return astData.map((ast, index) => {
        const { ast_id, ast_value, name, cat_color, cat_name, code, perf, perf100, price, quantity } = ast
        return (
            <tr key={index} onClick={() => window.location = "/assets/" + ast_id}>
                <td>{name}</td>
                <td>{code}</td>
                <td style={{ color: cat_color }}>{cat_name}</td>
                <td>{quantity}</td>
                <td>{Math.round(price * 100) / 100}</td>
                <td>{Math.round(ast_value * 100) / 100}</td>
                <td className={`${perf >= 0 ? "text-success" : "text-danger"}`}>
                  {perf > 0 ? "+ " : perf < 0 ? "- " : ""}
                  {Math.round(Math.abs(perf) * 100) / 100}
                </td>
                <td className={`${perf100 >= 0 ? "text-success" : "text-danger"}`}>
                  {perf100 > 0 ? "+ " : perf100 < 0 ? "- " : ""}
                  {Math.round(Math.abs(perf100) * 100) / 100} % 
                </td>
            </tr>
        )
      })
    } else {
      return (<tr></tr>)
    }

  }
  renderPlatformCards() {
    return this.state.userPltIds.map((plt_id, index) => {
      const pltDetails = this.state.platforms[this.state.platforms.findIndex(plt => plt.plt_id === plt_id)];
      return (
        <Row key={index}>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4" className="no-margin-bottom" style={{color: pltDetails.color}}>{pltDetails.name}</CardTitle>
              </CardHeader>
              <CardBody>
                <Table>
                  <thead className="text-primary">
                    <tr>
                      <th>Name</th>
                      <th>Ticker / Coin</th>
                      <th>Category</th>
                      <th>Current Quantity</th>
                      <th>Average Buying Price</th>
                      <th>Current Value</th>
                      <th>Performance</th>
                      <th>RoI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.renderTableData(this.state.assetsInPlatforms[plt_id])}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )
    })
  }
  render() {
    return (
      <>
        <div>
          <Row>
            <Col md="12">
              <PortfolioPlatformDistribution></PortfolioPlatformDistribution>
            </Col>
          </Row>
          {this.renderPlatformCards()}
        </div>
      </>
    );
  }
}

export default PlatformsPortfolio;
