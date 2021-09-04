import React, { Component } from "react";

import PortfolioNavbar from "components/navbars/PortfolioNavbar";
import OverviewPortfolio from "views/portfolio/Overview";
import InvestmentsPortfolio from "views/portfolio/Investments";

class IndexPortfolio extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedPortfolioPage: "overview"
    }
    this.handleClickPortfolioNavButton = this.handleClickPortfolioNavButton.bind(this);
  }

  handleClickPortfolioNavButton(page) {
    this.setState({ selectedPortfolioPage: page })
  }

  render() {
    const portfolioPage = this.state.selectedPortfolioPage
    return (
      <>
        <div className="content">
        <PortfolioNavbar
          selectedPortfolioPage={portfolioPage}
          handleClickNavButton={this.handleClickPortfolioNavButton}>
        </PortfolioNavbar>
        {portfolioPage === "overview" 
          ? <OverviewPortfolio></OverviewPortfolio>
          : portfolioPage === "investments" 
          ? <InvestmentsPortfolio></InvestmentsPortfolio>
          : portfolioPage === "categories"
          ? <InvestmentsPortfolio></InvestmentsPortfolio>
          : <InvestmentsPortfolio></InvestmentsPortfolio>
      }
        </div>
      </>
    );
  }
}

export default IndexPortfolio;
