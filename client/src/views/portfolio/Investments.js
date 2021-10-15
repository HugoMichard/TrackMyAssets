import React, { Component } from "react";

import APIService from "routers/apiservice";

// reactstrap components
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardFooter
} from "reactstrap";
import PortfolioCumulativeInvestments from "components/charts/PortfolioCumulativeInvestments";
import PortfolioInvestments from "components/charts/PortfolioInvestments";

class InvestmentsPortfolio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalInvested: 0,
      totalWithdrawn: 0,
      totalPortfolioValue: 0
    }
  }
  componentDidMount() {
    APIService.getInvestmentsSummary().then(res => {
      this.setState({
        totalInvested: res.data.totalInvested,
        totalWithdrawn: res.data.totalWithdrawn,
        totalPortfolioValue: res.data.totalPortfolioValue
      })
    })
  }

  render() {
    const { totalInvested, totalPortfolioValue, totalWithdrawn } = this.state
    return (
      <>
        <div>
          <Row>
            <Col lg="3" md="6" sm="6">
              <Card className="card-stats">
                <CardBody>
                  <Row className={`${totalInvested >= 0 ? "text-success" : "text-danger"}`}>
                    <Col md="7" xs="7">
                      <div className="text-center numbers">
                        <CardTitle tag="p">
                          {totalInvested > 0 ? "+ " : totalInvested < 0 ? "- " : ""}
                          {Math.round(Math.abs(totalInvested) * 10) / 10}
                        </CardTitle>
                        <p />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <hr />
                  <div className="stats">
                    <i className="far fa-clock" /> Total Invested
                  </div>
                </CardFooter>
              </Card>
            </Col>
            <Col lg="3" md="6" sm="6">
              <Card className="card-stats">
                <CardBody>
                  <Row className={`${totalPortfolioValue >= 0 ? "text-success" : "text-danger"}`}>
                    <Col md="7" xs="7">
                      <div className="text-center numbers">
                        <CardTitle tag="p">
                          {totalPortfolioValue > 0 ? "+ " : totalPortfolioValue < 0 ? "- " : ""}
                          {Math.round(Math.abs(totalPortfolioValue) * 10) / 10}
                        </CardTitle>
                        <p />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <hr />
                  <div className="stats">
                    <i className="far fa-calendar" /> Total Portfolio Value
                  </div>
                </CardFooter>
              </Card>
            </Col>
            <Col lg="3" md="6" sm="6">
              <Card className="card-stats">
                <CardBody>
                  <Row className={`${totalWithdrawn >= 0 ? "text-success" : "text-danger"}`}>
                    <Col md="7" xs="7">
                      <div className="text-center numbers">
                          <CardTitle tag="p">
                            {totalWithdrawn > 0 ? "+ " : totalWithdrawn < 0 ? "- " : ""}
                            {Math.round(Math.abs(totalWithdrawn) * 10) / 10}
                          </CardTitle>
                        <p />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <hr />
                  <div className="stats">
                    <i className="fa fa-history" /> Total Withdrawn
                  </div>
                </CardFooter>
              </Card>
            </Col>
          </Row>
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
