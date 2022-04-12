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
      assetsInPlatforms: []
    }
  }
  componentDidMount() {
    APIService.getPortfolioValueForeachPlt().then(res => {
      this.setState({assetsInPlatforms: res.data.values}); 
    })
  }
  renderTableData(astData) {
    if(astData) {
      return astData.map((ast, index) => {
        const { ast_id, vl, ast_type, duplicate_nbr, ast_name, cat_color, cat_name, code, perf, perf100, average_paid, quantity } = ast
        return (
            <tr key={index} onClick={() => window.location = "/app/assets/" + ast_id}>
                <td>{ast_name}</td>
                <td>{ast_type === "stock" ? code : ast_type === "crypto" ? code.slice(0, -duplicate_nbr.toString().length) : ""}</td>
                <td style={{ color: cat_color }}>{cat_name}</td>
                <td>{Math.round(quantity * 1000) / 1000}</td>
                <td>{Math.round(average_paid * 100) / 100}</td>
                <td>{Math.round(vl * 100) / 100}</td>
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
    if(this.state.assetsInPlatforms) {
      return this.state.assetsInPlatforms.map((pltDetails, index) => {
        const assetsInPlt = pltDetails.assets;
        const total = Math.round(pltDetails.value * 10) / 10;
        const perf = Math.round(pltDetails.perf * 10) / 10;
        const perf100 = Math.round(pltDetails.perf100 * 10 / 10);
        if(pltDetails) {
          return (
            <Row key={index}>
              <Col md="12">
                <Card>
                  <CardHeader>
                    <CardTitle tag="h4" className="no-margin-bottom" style={{color: pltDetails.color}}>{pltDetails.name}</CardTitle>
                    <span className="card-title">
                      Total : <strong>{total}</strong>
                    </span><br/>
                    <span className="card-title">
                      RoI : 
                      <strong className={`${perf >= 0 ? "greentext" : "redtext"}`}> {perf < 0 ? "- " : "+ "} {Math.abs(perf)} </strong>
                       / 
                      <strong className={`${perf >= 0 ? "greentext" : "redtext"}`}> {perf < 0 ? "- " : "+ "} {Math.abs(perf100)} %</strong>
                    </span>
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
              <PortfolioPlatformDistribution assetsInPlatforms={this.state.assetsInPlatforms}></PortfolioPlatformDistribution>
            </Col>
          </Row>
          {this.renderPlatformCards()}
        </div>
      </>
    );
  }
}

export default PlatformsPortfolio;
