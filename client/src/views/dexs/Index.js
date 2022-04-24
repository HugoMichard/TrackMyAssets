import React, { Component } from "react";
import APIService from "routers/apiservice";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Table,
  Row,
  Col,
} from "reactstrap";

class IndexDexs extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            dexs: []
        }
    }
    componentDidMount() {
        APIService.searchPlatformDexs().then(res => { 
            const dexs = res.data.dexs
            APIService.searchWallets().then(res => {
                var displayDexs = []
                dexs.forEach(d => {
                    displayDexs.push({
                        detail: d,
                        wallets: res.data.wallets.filter(w => w.plt_id === d.plt_id)
                    })
                })
                displayDexs = displayDexs.filter(d => d.wallets.length > 0);
                this.setState({ displayDexs: displayDexs }); 
            });
        });
    }
    renderTableData(wallets) {
        if(wallets) {
            return wallets.map((wlt, index) => {
                const { name, fix_vl, quantity, rewards } = wlt
                return (
                    <tr key={index}>
                        <td>{name}</td>
                        <td>{Math.round((fix_vl - rewards) * quantity * 10) / 10}</td>
                        <td>{Math.round(rewards * quantity * 10) / 10}</td>
                    </tr>
                )
            })
        } else {
            return (<tr></tr>)
        }
    }
    displayIncludingRewards(rewards) {
        if(rewards > 0) {
            return (
            <span>including <strong>{rewards}</strong> in rewards</span>
            )
        } else {
            return (<span></span>)
        }
    }
    renderWalletCards() {
        if(this.state.displayDexs) {
            const orderedDexs = this.state.displayDexs.sort((a, b) => {return a.detail.name > b.detail.name ? 1 : -1});
            return orderedDexs.map((dex, index) => {
                if(dex.detail) {
                    const total = Math.round(dex.wallets.map(w => (w.fix_vl * w.quantity)).reduce((p,n) => p + n) * 10) / 10;
                    const totalRewards = Math.round(dex.wallets.map(w => (w.rewards * w.quantity)).reduce((p,n) => p + n) * 10) / 10;
                    return (
                        <Row key={index}>
                            <Col md="12">
                                <Card>
                                <CardHeader>
                                    <CardTitle tag="h4" className="no-margin-bottom" style={{color: dex.detail.color}}>{dex.detail.name}</CardTitle>
                                    <span className="card-title">
                                        Total : <strong>{total}</strong> {this.displayIncludingRewards(totalRewards)}
                                    </span> <br/>    
                                </CardHeader>
                                <CardBody>
                                    <Table responsive>
                                    <thead className="text-primary">
                                        <tr>
                                        <th>Name</th>
                                        <th>Value</th>
                                        <th>Rewards</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.renderTableData(dex.wallets)}
                                    </tbody>
                                    </Table>
                                </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    )
                } else {
                    return(<Row></Row>)
                }
            })
        } else {
            return(<Row></Row>)
        }
    }
    render() {
        if(!this.state.displayDexs || this.state.displayDexs.length === 0) {
            return (
                <div className="content">
                    <Card> 
                        <CardHeader tag="h4">Welcome to your DEX Wallet page !</CardHeader>
                        <CardBody>
                            <p>
                                You currently do not own any cryptocurrency assets on a decentralized platform. To get started, <a href="/app/platforms/create">add some of the decentralized platforms you use</a>. To do so, link the platform you create to one of the available DEX and input your non-custodial wallet address. <br/>
                                Then, <a href="/app/orders/create">input the orders you make on this platform</a> and your assets on this DEX will be tracked automatically !
                            </p>
                        </CardBody>
                    </Card>
                </div>
            )
        }
        return (
        <>
            <div className="content">
                <Row>
                    <Col lg="3" md="6" sm="6">
                        <Card className="card-stats">
                            <CardBody>
                            <Row>
                                <Col md="12" xs="12">
                                <div className="text-center numbers">
                                    <CardTitle tag="p">
                                        {Math.round(Math.abs(
                                            this.state.displayDexs ? this.state.displayDexs.map(d => d.wallets.map(w => (w.fix_vl + w.rewards) * w.quantity).reduce((p , n) => p + n)).reduce((p , n) => p + n) : 0
                                        ) * 100) / 100} €
                                    </CardTitle>
                                    <p />
                                </div>
                                </Col>
                            </Row>
                            </CardBody>
                            <CardFooter>
                            <hr />
                            <div className="stats">
                                <i className="nc-icon nc-briefcase-24" /> Total In Dex Wallets
                            </div>
                            </CardFooter>
                        </Card>
                    </Col>
                    <Col lg="3" md="6" sm="6">
                        <Card className="card-stats">
                            <CardBody>
                            <Row>
                                <Col md="12" xs="12">
                                <div className="text-center numbers">
                                    <CardTitle tag="p">
                                        {Math.round(Math.abs(
                                            this.state.displayDexs ? this.state.displayDexs.map(d => d.wallets.map(w => w.rewards * w.quantity).reduce((p , n) => p + n)).reduce((p , n) => p + n) : 0
                                        ) * 100) / 100} €
                                    </CardTitle>
                                    <p />
                                </div>
                                </Col>
                            </Row>
                            </CardBody>
                            <CardFooter>
                            <hr />
                            <div className="stats">
                                <i className="nc-icon nc-air-baloon" /> Total Rewards In Dex Wallets
                            </div>
                            </CardFooter>
                        </Card>
                    </Col>
                </Row>
                {this.renderWalletCards()}
            </div>
        </>
        );
    }
}

export default IndexDexs;
