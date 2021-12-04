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
import PortfolioPlusValueHistory from "components/charts/PortfolioPlusValueHistory";
import PortfolioAssetDistribution from "components/charts/PortfolioAssetDistribution";

class OverviewPortfolio extends Component {
    constructor(props) {
        super(props);
        const typeValueToLabel = {
            stock: "Stock",
            crypto: "Crypto",
            fix: "FPA",
            dex: "DEX"
        }
        this.state = { 
            assetsOwned: [],
            typeValueToLabel: typeValueToLabel
        }
    }
    componentDidMount() {
        APIService.getAssetsOwned().then(res => { this.setState({assetsOwned: res.data.assets}); })
    }
    renderTableData() {
      if(this.state.assetsOwned) {
        return this.state.assetsOwned.map((ast, index) => {
          const { ast_id, name, ast_type, ast_value, quantity, price, perf, perf100, cat_color, cat_name, code, duplicate_nbr } = ast
          return (
            <tr key={index} onClick={() => window.location = "/assets/" + ast_id}>
              <td>{name}</td>
              <td>{ast_type === "stock" ? code : ast_type === "crypto" ? code.slice(0, -duplicate_nbr.toString().length) : ""}</td>
              <td>{this.state.typeValueToLabel[ast_type]}</td>
              <td style={{ color: cat_color }}>{cat_name}</td>
              <td>{Math.round(quantity * 1000) / 1000}</td>
              <td>{Math.round(price * 10) / 10}</td>
              <td>{Math.round(ast_value * 10) / 10}</td>
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
  render() {
    return (
      <>
        <div>
          <Row>
            <Col md="12">
              <PortfolioPlusValueHistory></PortfolioPlusValueHistory>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <PortfolioAssetDistribution assetsOwned={this.state.assetsOwned}></PortfolioAssetDistribution>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4" className="no-margin-bottom">Assets owned</CardTitle>
                </CardHeader>
                <CardBody>
                  <Table responsive>
                    <thead className="text-primary">
                      <tr>
                        <th>Name</th>
                        <th>Ticker / Coin</th>
                        <th>Type</th>
                        <th>Category</th>
                        <th>Current Quantity</th>
                        <th>Average Buying Price</th>
                        <th>Current value</th>
                        <th>Performance</th>
                        <th>RoI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.renderTableData()}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default OverviewPortfolio;
