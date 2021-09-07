import React, { Component } from "react";

// reactstrap components
import {
  Row,
  Col
} from "reactstrap";
import PortfolioCategoryDistribution from "components/charts/PortfolioCategoryDistribution";
import PortfolioTypeDistribution from "components/charts/PortfolioTypeDistribution";

class CategoriesPortfolio extends Component {
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
        </div>
      </>
    );
  }
}

export default CategoriesPortfolio;
