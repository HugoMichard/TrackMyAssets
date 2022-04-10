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
            typeValueToLabel: typeValueToLabel,
            perfAssets: 0,
            perf100Assets: 0,
            totalAssets: 0
        }
    }
    componentDidMount() {
        APIService.getAssetsOwned().then(res => {
          const assets = res.data.assets;
          const total = Math.round(assets.map(c => (c.vl * c.quantity)).reduce((p,n) => p + n) * 10) / 10;
          const perf = Math.round(assets.map(c => c.perf).reduce((p,n) => p + n) * 10) / 10;
          const perf100 = Math.round((perf / total) * 100 * 10 / 10);
          this.setState({assetsOwned: assets, totalAssets: total, perfAssets: perf, perf100Assets: perf100});
        })
    }
    renderTableData() {
      if(this.state.assetsOwned) {
        return this.state.assetsOwned.map((ast, index) => {
          const { ast_id, ast_name, ast_type, vl, quantity, average_paid, perf, perf100, cat_color, cat_name, code, duplicate_nbr } = ast
          return (
            <tr key={index} onClick={() => window.location = "/app/assets/" + ast_id}>
              <td>{ast_name}</td>
              <td>{ast_type === "stock" ? code : ast_type === "crypto" ? code.slice(0, -duplicate_nbr.toString().length) : ""}</td>
              <td>{this.state.typeValueToLabel[ast_type]}</td>
              <td style={{ color: cat_color }}>{cat_name}</td>
              <td>{Math.round(quantity * 1000) / 1000}</td>
              <td>{Math.round(average_paid * 10) / 10}</td>
              <td>{Math.round(vl * 10) / 10}</td>
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
    const { totalAssets, perfAssets, perf100Assets } = this.state
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
                  <span className="card-title">
                    Total : <strong>{totalAssets}</strong>
                  </span><br/>
                  <span className="card-title">
                    RoI : 
                    <strong className={`${perfAssets >= 0 ? "greentext" : "redtext"}`}> {perfAssets < 0 ? "- " : "+ "} {Math.abs(perfAssets)} </strong>
                    / 
                    <strong className={`${perfAssets >= 0 ? "greentext" : "redtext"}`}> {perfAssets < 0 ? "- " : "+ "} {Math.abs(perf100Assets)} %</strong>
                  </span>
                </CardHeader>
                <CardBody>
                  <Table responsive>
                    <thead className="text-primary">
                      <tr>
                        <th>Name</th>
                        <th>Ticker / Coin</th>
                        <th>Type</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Buying Price</th>
                        <th>Value</th>
                        <th>Perf</th>
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
