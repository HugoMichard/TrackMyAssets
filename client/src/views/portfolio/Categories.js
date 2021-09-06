import React, { Component } from "react";

import APIService from "routers/apiservice";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col,
  Button,
  Table
} from "reactstrap";
import PortfolioCategoryDistribution from "components/charts/PortfolioCategoryDistribution";
import PortfolioTypeDistribution from "components/charts/PortfolioTypeDistribution";

class InvestmentsPortfolio extends Component {
  render() {
    return (
      <>
        <div>
          <Row>
            <Col md="12">
              <PortfolioCategoryDistribution></PortfolioCategoryDistribution>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <PortfolioTypeDistribution></PortfolioTypeDistribution>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default InvestmentsPortfolio;
