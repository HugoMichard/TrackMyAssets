import React, { Component } from "react";

// reactstrap components
import {
  Card,
  CardBody,
  Row,
  Col,
  Button
} from "reactstrap";

class PortfolioNavbar extends Component {
  renderPortfolioNavButton(text, page, color) {
    return (
      <Button
        className={`${this.props.selectedPortfolioPage === page ? "btn-square" : "btn-round"}`}
        color={color}
        onClick={() => this.props.handleClickNavButton(page)}>
        {text}
      </Button>
    );
  }
  
  render() {
    return (
      <>
        <div className="content">
          <Row>
            <Col md="12">
              <Card>
                <CardBody>
                    <div>
                      {this.renderPortfolioNavButton("Overview", "overview", "danger")}
                      {this.renderPortfolioNavButton("Investments", "investments", "warning")}
                      {this.renderPortfolioNavButton("Categories", "categories", "info")}
                      {this.renderPortfolioNavButton("Platforms", "platforms", "success")}
                    </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default PortfolioNavbar;
