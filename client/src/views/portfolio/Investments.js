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
import PortfolioCumulativeInvestments from "components/charts/PortfolioCumulativeInvestments";
import PortfolioInvestments from "components/charts/PortfolioInvestments";

class InvestmentsPortfolio extends Component {
  render() {
    return (
      <>
        <div>
          <Row>
            <Col md="12">
              <PortfolioInvestments></PortfolioInvestments>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <PortfolioCumulativeInvestments></PortfolioCumulativeInvestments>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default InvestmentsPortfolio;
