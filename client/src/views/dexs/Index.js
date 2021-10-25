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
            return this.state.displayDexs.map((dex, index) => {
                if(dex.detail) {
                    const total = Math.round(dex.wallets.map(w => (w.fix_vl * w.quantity)).reduce((p,n) => p + n) * 10) / 10;
                    const totalRewards = Math.round(dex.wallets.map(w => (w.rewards * w.quantity)).reduce((p,n) => p + n) * 10) / 10;
                    return (
                        <Row key={index}>
                            <Col md="12">
                                <Card>
                                <CardHeader>
                                    <CardTitle tag="h4" className="no-margin-bottom" style={{color: dex.detail.color}}>{dex.detail.name}</CardTitle>
                                    <CardTitle tag="h7">
                                        Total : <strong>{total}</strong> {this.displayIncludingRewards(totalRewards)}
                                    </CardTitle> <br/>    
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
        return (
        <>
            <div className="content">
                <Row>
                    <Col lg="3" md="6" sm="6">
                        <Card className="card-stats">
                            <CardBody>
                            <Row>
                                <Col md="7" xs="7">
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
                                <Col md="7" xs="7">
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
