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
        const { ast_id, ast_value, ast_type, duplicate_nbr, name, cat_color, cat_name, code, perf, perf100, price, quantity } = ast
        return (
            <tr key={index} onClick={() => window.location = "/app/assets/" + ast_id}>
                <td>{name}</td>
                <td>{ast_type === "stock" ? code : ast_type === "crypto" ? code.slice(0, -duplicate_nbr.toString().length) : ""}</td>
                <td style={{ color: cat_color }}>{cat_name}</td>
                <td>{Math.round(quantity * 1000) / 1000}</td>
                <td>{Math.round(price * 100) / 100}</td>
                <td>{Math.round(ast_value * 100) / 100}</td>
                <td className={`${perf >= 0 ? "greentext" : "redtext"}`}>
                  {perf > 0 ? "+ " : perf < 0 ? "- " : ""}
                  {Math.round(Math.abs(perf))}
                </td>
                <td className={`${perf100 >= 0 ? "greentext" : "redtext"}`}>
                  {perf100 > 0 ? "+ " : perf100 < 0 ? "- " : ""}
                  {Math.round(Math.abs(perf100))} % 
                </td>
            </tr>
        )
      })
    } else {
      return (<tr></tr>)
    }

  }
  renderPlatformCards() {
    if(this.state.userPltIds && this.state.platforms) {
      return this.state.userPltIds.map((plt_id, index) => {
        const pltDetails = this.state.platforms[this.state.platforms.findIndex(plt => plt.plt_id === plt_id)];
        const assetsInPlt = this.state.assetsInPlatforms[plt_id]
        const total = Math.round(assetsInPlt.map(c => (c.ast_value * c.quantity)).reduce((p,n) => p + n) * 10) / 10;
        if(pltDetails) {
          return (
            <Row key={index}>
              <Col md="12">
                <Card>
                  <CardHeader>
                    <CardTitle tag="h4" className="no-margin-bottom" style={{color: pltDetails.color}}>{pltDetails.name}</CardTitle>
                    <CardTitle tag="h7">
                      Total : <strong>{total}</strong>
                    </CardTitle>
                  </CardHeader>
                  <CardBody>
                    <Table responsive>
                      <thead className="text-primary">
                        <tr>
                          <th>Name</th>
                          <th>Ticker / Coin</th>
                          <th>Category</th>
                          <th>Quantity</th>
                          <th>Buying Price</th>
                          <th>Value</th>
                          <th>Performance</th>
                          <th>RoI</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.renderTableData(assetsInPlt)}
                      </tbody>
                    </Table>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )
        } else { return(<Row></Row>) }
      })
    } else {
      return(<Row></Row>)
    }
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
