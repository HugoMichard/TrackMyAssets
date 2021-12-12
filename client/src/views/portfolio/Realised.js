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
            typeValueToLabel: typeValueToLabel
        }
    }
    componentDidMount() {
        APIService.getProfitsRealised().then(res => { this.setState({profitsRealised: res.data.profits}); })
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
    return (
      <>
        <div>
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4" className="no-margin-bottom">Profits and Losses Realised</CardTitle>
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
                        <th>Average Buying Price</th>
                        <th>Average Selling Price</th>
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
