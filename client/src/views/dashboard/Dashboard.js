import React, { Component } from "react";
// react plugin used to create charts
import { Line, Pie } from "react-chartjs-2";

import AuthService from "services/auth";
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
  Button
} from "reactstrap";
// core components
import {
  dashboard24HoursPerformanceChart,
  dashboardEmailStatisticsChart,
  dashboardNASDAQChart,
} from "assets/paper/variables/charts.js";

import {
  PortfolioPriceHistoryChart,
  PortfolioPriceHistoryChartData
} from "variables/charts/PortfolioPriceHistoryChart";

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
      pDiffYear: 0,
      selectedPortfolioChartRange: "year",
      portfolioChartData: [{
        "id": PortfolioPriceHistoryChartData[0].id,
        "data": PortfolioPriceHistoryChartData[0].data
      }]
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
    this.updatePortfolioChartDataWithRange(this.state.selectedPortfolioChartRange);
  }
  handleClickPortfolioRange(value) {
    this.setState({selectedPortfolioChartRange: value});
    this.updatePortfolioChartDataWithRange(value)
  }
  updatePortfolioChartDataWithRange(range) {
    APIService.getPortfolioValueHistory({ portfolio_chart_start_date: range }).then(res => {
      const data = res.data.values.map(v => {
        return {
            "x": new Date(v.random_date).toLocaleDateString(),
            "y": v.value
        }
      });
      var portfolioChartData = this.state.portfolioChartData
      portfolioChartData[0].data = data
      this.setState({portfolioChartData: portfolioChartData });
    })
  }
  displayCardValue(percentage, value, periodName) {
    return (
      <Col lg="3" md="6" sm="6">
        <Card className="card-stats">
          <CardBody>
            <Row className={`${value >= 0 ? "text-success" : "text-danger"}`}>
              <Col md="7" xs="7">
              <div className="text-center numbers">
                <CardTitle tag="p">
                  {value > 0 ? "+ " : value < 0 ? "- " : ""}
                  {Math.round(Math.abs(percentage) * 10) / 10} %
                </CardTitle>
                <p />
              </div>
              </Col>
              <Col md="5" xs="5">
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
  renderPortfolioRangeButton(text, range, color) {
    return (
      <Button
        className={`justify-content-end no-margin-top ${this.state.selectedPortfolioChartRange === range ? "btn-square" : "btn-round"}`}
        color={color}
        onClick={() => this.handleClickPortfolioRange(range)}>
        {text}
      </Button>
    );
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
              <Card>
                <CardHeader>
                  <CardTitle tag="h5">Portfolio Value Evolution</CardTitle>
                  {this.renderPortfolioRangeButton("Year", "year", "danger")}
                  {this.renderPortfolioRangeButton("Month", "month", "warning")}
                  {this.renderPortfolioRangeButton("Week", "week", "info")}
                  {this.renderPortfolioRangeButton("All", "all", "success")}
                </CardHeader>
                <CardBody style={ { height: 500 } }>
                  {PortfolioPriceHistoryChart(this.state.portfolioChartData)}
                </CardBody>
                <CardFooter>
                  <hr />
                  <div className="stats">
                    <i className="fa fa-history" /> Updated 3 minutes ago
                  </div>
                </CardFooter>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md="4">
              <Card>
                <CardHeader>
                  <CardTitle tag="h5">Email Statistics</CardTitle>
                  <p className="card-category">Last Campaign Performance</p>
                </CardHeader>
                <CardBody style={{ height: "266px" }}>
                  <Pie
                    data={dashboardEmailStatisticsChart.data}
                    options={dashboardEmailStatisticsChart.options}
                  />
                </CardBody>
                <CardFooter>
                  <div className="legend">
                    <i className="fa fa-circle text-primary" /> Opened{" "}
                    <i className="fa fa-circle text-warning" /> Read{" "}
                    <i className="fa fa-circle text-danger" /> Deleted{" "}
                    <i className="fa fa-circle text-gray" /> Unopened
                  </div>
                  <hr />
                  <div className="stats">
                    <i className="fa fa-calendar" /> Number of emails sent
                  </div>
                </CardFooter>
              </Card>
            </Col>
            <Col md="8">
              <Card className="card-chart">
                <CardHeader>
                  <CardTitle tag="h5">NASDAQ: AAPL</CardTitle>
                  <p className="card-category">Line Chart with Points</p>
                </CardHeader>
                <CardBody>
                  <Line
                    data={dashboardNASDAQChart.data}
                    options={dashboardNASDAQChart.options}
                    width={400}
                    height={100}
                  />
                </CardBody>
                <CardFooter>
                  <div className="chart-legend">
                    <i className="fa fa-circle text-info" /> Tesla Model S{" "}
                    <i className="fa fa-circle text-warning" /> BMW 5 Series
                  </div>
                  <hr />
                  <div className="card-stats">
                    <i className="fa fa-check" /> Data information certified
                  </div>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Dashboard;
