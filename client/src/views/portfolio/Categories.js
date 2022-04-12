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

import PortfolioCategoryDistribution from "components/charts/PortfolioCategoryDistribution";
import PortfolioTypeDistribution from "components/charts/PortfolioTypeDistribution";

class CategoriesPortfolio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assetsInCategories: []
    }
  }
  componentDidMount() {
    APIService.getPortfolioValueForeachCat().then(res => {
      this.setState({assetsInCategories: res.data.values}); 
    })
  }
  renderTableData(astData) {
    if(astData) {
      return astData.map((ast, index) => {
        const { ast_id, vl, ast_type, ast_name, code, perf, perf100, average_paid, quantity, duplicate_nbr } = ast
        return (
            <tr key={index} onClick={() => window.location = "/app/assets/" + ast_id}>
                <td>{ast_name}</td>
                <td>{ast_type === "stock" ? code : ast_type === "crypto" ? code.slice(0, -duplicate_nbr.toString().length) : ""}</td>
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
  renderCategoryCards() {
    if(this.state.assetsInCategories) {
      return this.state.assetsInCategories.map((categoryDetails, index) => {
        const perf = Math.round(categoryDetails.perf * 10) / 10;
        const perf100 = Math.round(categoryDetails.perf100 * 10) / 10;
        const total = Math.round(categoryDetails.value * 10) / 10;
        const assetsInCat = categoryDetails.assets;
        return (
          <Row key={index}>
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4" className="no-margin-bottom" style={{color: categoryDetails.color}}>{categoryDetails.name}</CardTitle>
                  <span className="no-margin-bottom">
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
                        <th>Quantity</th>
                        <th>Buying Price</th>
                        <th>Value</th>
                        <th>Performance</th>
                        <th>RoI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.renderTableData(assetsInCat)}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        )
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
            <Col md="6">
              <PortfolioCategoryDistribution assetsInCategories={this.state.assetsInCategories}></PortfolioCategoryDistribution>
            </Col>
            <Col md="6">
              <PortfolioTypeDistribution></PortfolioTypeDistribution>
            </Col>
          </Row>
          {this.renderCategoryCards()}
        </div>
      </>
    );
  }
}

export default CategoriesPortfolio;
