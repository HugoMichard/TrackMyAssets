import React, { Component } from "react";

import AuthService from "services/auth";
import APIService from "routers/apiservice";

// reactstrap components
import {
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col
} from "reactstrap";

import PortfolioPriceHistory from "components/charts/PortfolioPriceHistory";

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      diffDay: 0,
      pDiffDay: 0,
      diffWeek: 0,
      pDiffWeek: 0,
      diffMonth: 0,
      pDiffMonth: 0,
      diffYear: 0,
      pDiffYear: 0
    }
  }
  getDiffTodayWithDateColumn(dayValues, dateColumn) {
    return dayValues[0] - dayValues[dateColumn];
  }
  getPourcentageDiffTodayWithDateColumn(dayValues, dateColumn) {
    return 100 * (dayValues[0] - dayValues[dateColumn]) / dayValues[dateColumn];
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user
      });
    }
    APIService.getDashboardSummary().then(res => {
      const dayValues = res.data.dayValues;
      this.setState({
        diffDay: this.getDiffTodayWithDateColumn(dayValues, 1),
        pDiffDay: this.getPourcentageDiffTodayWithDateColumn(dayValues, 1),
        diffWeek: this.getDiffTodayWithDateColumn(dayValues, 2),
        pDiffWeek: this.getPourcentageDiffTodayWithDateColumn(dayValues, 2),
        diffMonth: this.getDiffTodayWithDateColumn(dayValues, 3),
        pDiffMonth: this.getPourcentageDiffTodayWithDateColumn(dayValues, 3),
        diffYear: this.getDiffTodayWithDateColumn(dayValues, 4),
        pDiffYear: this.getPourcentageDiffTodayWithDateColumn(dayValues, 4)
      })
    });
  }
  displayCardValue(percentage, value, periodName) {
    return (
      <Col lg="3" md="6" sm="6">
        <Card className="card-stats">
          <CardBody>
            <Row className={`${value >= 0 ? "text-success" : "text-danger"}`}>
              {percentage !== Infinity ? 
                <Col md="6" xs="6">
                  <div className="text-center numbers">
                    <CardTitle tag="p">
                    {console.log(percentage === undefined)}
                    {console.log(percentage === Infinity)}
                    {console.log(percentage)}
                      {value > 0 ? "+ " : value < 0 ? "- " : ""}
                      {Math.round(Math.abs(percentage) * 10) / 10} %
                    </CardTitle>
                    <p />
                  </div>
                </Col> : ""
              }
              <Col md="6" xs="6">
                <div className="numbers">
                  <CardTitle tag="p">
                    {value > 0 ? "+ " : value < 0 ? "- " : ""}
                    {Math.round(Math.abs(value) * 10) / 10}
                  </CardTitle>
                  <p />
                </div>
              </Col>
            </Row>
          </CardBody>
          <CardFooter>
            <hr />
            <div className="stats">
              <i className="far fa-calendar" /> Last {periodName}
            </div>
          </CardFooter>
        </Card>
      </Col>
    )
  }
  render() {
    return (
      <>
        <div className="content">
          <Row>
            {this.displayCardValue(this.state.pDiffDay, this.state.diffDay, "day")}
            {this.displayCardValue(this.state.pDiffWeek, this.state.diffWeek, "week")}
            {this.displayCardValue(this.state.pDiffMonth, this.state.diffMonth, "month")}
            {this.displayCardValue(this.state.pDiffYear, this.state.diffYear, "year")}
          </Row>
          <Row>
            <Col md="12">
              <PortfolioPriceHistory></PortfolioPriceHistory>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Dashboard;
