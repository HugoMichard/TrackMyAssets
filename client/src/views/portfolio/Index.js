import React, { Component } from "react";
import APIService from "routers/apiservice";

import PortfolioNavbar from "components/navbars/PortfolioNavbar";
import OverviewPortfolio from "views/portfolio/Overview";
import InvestmentsPortfolio from "views/portfolio/Investments";
import CategoriesPortfolio from "views/portfolio/Categories";
import PlatformsPortfolio from "views/portfolio/Platforms";
import RealisedPortfolio from "views/portfolio/Realised";

import EmptyWelcome from "components/cards/EmptyWelcome";


class IndexPortfolio extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedPortfolioPage: "overview",
      isPortfolioEmpty: undefined
    }
    this.handleClickPortfolioNavButton = this.handleClickPortfolioNavButton.bind(this);
  }
  componentDidMount() {
    APIService.searchOrders({name: ""}).then(res => this.setState({ isPortfolioEmpty: res.data.orders.length === 0 }));

  }
  handleClickPortfolioNavButton(page) {
    this.setState({ selectedPortfolioPage: page })
  }

  render() {
    const portfolioPage = this.state.selectedPortfolioPage
    if(this.state.isPortfolioEmpty === undefined) {
      return (
        <div className="content"></div>
      )
    }
    if(this.state.isPortfolioEmpty) {
      return <EmptyWelcome title="Welcome to your Portfolio page !"></EmptyWelcome>
    }
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
