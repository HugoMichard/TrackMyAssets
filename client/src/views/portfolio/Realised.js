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

class RealisedPortfolio extends Component {
    constructor(props) {
        super(props);
        const typeValueToLabel = {
            stock: "Stock",
            crypto: "Crypto",
            fix: "FPA",
            dex: "DEX"
        }
        this.state = { 
            profitsRealised: [],
            typeValueToLabel: typeValueToLabel,
            perfAssets: 0,
            perf100Assets: 0,
            totalAssets: 0
        }
    }
    componentDidMount() {
        APIService.getProfitsRealised().then(res => { 
          const profits = res.data.profits;
          const total = Math.round(profits.map(c => (c.sell_price * c.quantity)).reduce((p,n) => p + n) * 10) / 10;
          const perf = Math.round(profits.map(c => c.perf).reduce((p,n) => p + n) * 10) / 10;
          const perf100 = Math.round((perf / total) * 100 * 10 / 10);
          this.setState({profitsRealised: profits, totalAssets: total, perfAssets: perf, perf100Assets: perf100}); 
        })
    }
    renderTableData() {
      if(this.state.profitsRealised) {
        return this.state.profitsRealised.map((ast, index) => {
          const { ast_id, name, ast_type, sell_price, quantity, buy_price, perf, perf100, cat_color, cat_name, code, duplicate_nbr } = ast
          return (
            <tr key={index} onClick={() => window.location = "/app/assets/" + ast_id}>
              <td>{name}</td>
              <td>{ast_type === "stock" ? code : ast_type === "crypto" ? code.slice(0, -duplicate_nbr.toString().length) : ""}</td>
              <td>{this.state.typeValueToLabel[ast_type]}</td>
              <td style={{ color: cat_color }}>{cat_name}</td>
              <td>{Math.round(quantity * 1000) / 1000}</td>
              <td>{Math.round(buy_price * 10) / 10}</td>
              <td>{Math.round(sell_price * 10) / 10}</td>
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
              <Card>
                <CardHeader>
                  <CardTitle tag="h4" className="no-margin-bottom">Profits and Losses Realised</CardTitle>
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
                        <th>Selling Price</th>
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

export default RealisedPortfolio;
