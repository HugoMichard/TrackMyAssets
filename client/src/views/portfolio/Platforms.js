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
import PortfolioPlatformDistribution from "components/charts/PortfolioPlatformDistribution";

class PlatformsPortfolio extends Component {
  render() {
    return (
      <>
        <div>
          <Row>
            <Col md="12">
              <PortfolioPlatformDistribution></PortfolioPlatformDistribution>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default PlatformsPortfolio;
