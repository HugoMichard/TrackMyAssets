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
      categories : [],
      assetsInCategories: {},
      userCatIds: []
    }
  }
  componentDidMount() {
    APIService.searchCategories({}).then(res => {
      this.setState({categories: res.data.categories});
    })

    APIService.getUserAssetsInEachCat().then(res => {
      this.setState({assetsInCategories: res.data.assetsByCat, userCatIds: res.data.categoryIds}); 
    })
  }
  renderTableData(astData) {
    if(astData) {
      return astData.map((ast, index) => {
        const { ast_id, ast_value, ast_type, name, code, perf, perf100, price, quantity, duplicate_nbr } = ast
        return (
            <tr key={index} onClick={() => window.location = "/app/assets/" + ast_id}>
                <td>{name}</td>
                <td>{ast_type === "stock" ? code : ast_type === "crypto" ? code.slice(0, -duplicate_nbr.toString().length) : ""}</td>
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
  renderCategoryCards() {
    if(this.state.userCatIds && this.state.categories) {
      return this.state.userCatIds.map((cat_id, index) => {
        const catDetails = this.state.categories[this.state.categories.findIndex(cat => cat.cat_id === cat_id)];
        if(catDetails) {
          const assetsInCat = this.state.assetsInCategories[cat_id]
          const total = Math.round(assetsInCat.map(c => (c.ast_value * c.quantity)).reduce((p,n) => p + n) * 10) / 10;
          return (
            <Row key={index}>
              <Col md="12">
                <Card>
                  <CardHeader>
                    <CardTitle tag="h4" className="no-margin-bottom" style={{color: catDetails.color}}>{catDetails.name}</CardTitle>
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
                          <th>Current Quantity</th>
                          <th>Average Buying Price</th>
                          <th>Current Value</th>
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
        } else {
          return(<Row></Row>)
        }
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
              <PortfolioCategoryDistribution></PortfolioCategoryDistribution>
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
