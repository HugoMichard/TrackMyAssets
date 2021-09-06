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
import PortfolioPlusValueHistory from "components/charts/PortfolioPlusValueHistory";

class OverviewPortfolio extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            categories: [],
            diffDay: 0,
            pDiffDay: 0,
            diffWeek: 0,
            pDiffWeek: 0,
            diffMonth: 0,
            pDiffMonth: 0,
            diff3Month: 0,
            pDiff3Month: 0,
            diffYear: 0,
            pDiffYear: 0,
            diffTotal: 0,
            pDiffTotal: 0
        }
    }
    componentDidMount() {
        APIService.getPortfolioPlusValueSummary().then(res => {
          const dayPlusValues = res.data.dayPlusValues;
          this.setState({
            diffDay: this.getDiffTodayWithDateColumn(dayPlusValues, 1),
            pDiffDay: this.getPourcentageDiffTodayWithDateColumn(dayPlusValues, 1),
            diffWeek: this.getDiffTodayWithDateColumn(dayPlusValues, 2),
            pDiffWeek: this.getPourcentageDiffTodayWithDateColumn(dayPlusValues, 2),
            diffMonth: this.getDiffTodayWithDateColumn(dayPlusValues, 3),
            pDiffMonth: this.getPourcentageDiffTodayWithDateColumn(dayPlusValues, 3),
            diff3Month: this.getDiffTodayWithDateColumn(dayPlusValues, 4),
            pDiff3Month: this.getPourcentageDiffTodayWithDateColumn(dayPlusValues, 4),
            diffYear: this.getDiffTodayWithDateColumn(dayPlusValues, 5),
            pDiffYear: this.getPourcentageDiffTodayWithDateColumn(dayPlusValues, 5),
            diffTotal: this.getDiffTodayWithDateColumn(dayPlusValues, 6),
            pDiffTotal: this.getPourcentageDiffTodayWithDateColumn(dayPlusValues, 6)
          })
        });
        APIService.searchCategory({}).then(res => { this.setState({categories: res.data.categories });});
    }
    getDiffTodayWithDateColumn(values, dateColumn) {
      return values[0] - values[dateColumn];
    }
    getPourcentageDiffTodayWithDateColumn(values, dateColumn) {
      return 100 * (values[0] - values[dateColumn]) / Math.abs(values[dateColumn]);
    }
    renderTableData() {
        return this.state.categories.map((cat, index) => {
            const { cat_id, name, color } = cat
            return (
                <tr key={index} onClick={() => window.location = "/categories/" + cat_id}>
                    <td>{name}</td>
                    <td style={{
                        color: color,
                        backgroundColor: color
                        }}>
                            {color}
                    </td>
                </tr>
            )
        })
    }
    displayCardPlusValue(percentage, value, periodName) {
        return (
          <Col lg="4" md="6" sm="6">
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
                  <i className="far fa-calendar" /> {periodName !=="Total" ? "Last" : ""} {periodName}
                </div>
              </CardFooter>
            </Card>
          </Col>
        )
      }

  render() {
    return (
      <>
        <div>
        <Row>
            {this.displayCardPlusValue(this.state.pDiffDay, this.state.diffDay, "day")}
            {this.displayCardPlusValue(this.state.pDiffWeek, this.state.diffWeek, "week")}
            {this.displayCardPlusValue(this.state.pDiffMonth, this.state.diffMonth, "month")}
            {this.displayCardPlusValue(this.state.pDiff3Month, this.state.diff3Month, "3 months")}
            {this.displayCardPlusValue(this.state.pDiffYear, this.state.diffYear, "year")}
            {this.displayCardPlusValue(this.state.pDiffTotal, this.state.diffTotal, "Total")}
          </Row>
            <Row>
            <Col md="12">
              <PortfolioPlusValueHistory></PortfolioPlusValueHistory>
            </Col>
          </Row>
            <Row>
            <Col md="12">
                <Card>
                    <CardHeader>
                        <CardTitle tag="h4" className="no-margin-bottom">Assets owned</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Table>
                            <thead className="text-primary">
                            <tr>
                              <th>Name</th>
                              <th>Type</th>
                              <th>Ticker / Coin</th>
                              <th>Category</th>
                              <th>Platform</th>
                              <th>Current Quantity</th>
                              <th>Average Buying Price</th>
                              <th>Quantity Sold</th>
                              <th>Average Selling Price</th>
                              <th>Total</th>
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

export default OverviewPortfolio;