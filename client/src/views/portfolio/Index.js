import React, { Component } from "react";

import PortfolioNavbar from "components/navbars/PortfolioNavbar";
import OverviewPortfolio from "views/portfolio/Overview";
import InvestmentsPortfolio from "views/portfolio/Investments";
import CategoriesPortfolio from "views/portfolio/Categories";
import PlatformsPortfolio from "views/portfolio/Platforms";
import RealisedPortfolio from "views/portfolio/Realised";

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
          ? <CategoriesPortfolio></CategoriesPortfolio>
          : portfolioPage === "platforms"
          ? <PlatformsPortfolio></PlatformsPortfolio>
          : <RealisedPortfolio></RealisedPortfolio>
      }
        </div>
      </>
    );
  }
}

export default IndexPortfolio;
