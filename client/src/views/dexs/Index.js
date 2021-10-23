import React, { Component } from "react";
import APIService from "routers/apiservice";
import { Link } from "react-router-dom";

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
  Button
} from "reactstrap";

class IndexDexs extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            wallets: [],
            dexs: []
        }
    }
    componentDidMount() {
        APIService.searchPlatformDexs().then(res => { 
            const dexs = res.data.dexs
            APIService.searchWallets().then(res => {
                console.log(dexs)
                console.log(res.data.wallets)
                var displayDexs = []
                dexs.forEach(d => {
                    displayDexs.push({
                        detail: d,
                        wallets: res.data.wallets.filter(w => w.plt_id === d.plt_id)
                    })
                })
                console.log(displayDexs)
                this.setState({ displayDexs: displayDexs }); 
            });
        });
    }
    renderTableData(wallets) {
        if(wallets) {
            return wallets.map((wlt, index) => {
                const { name, price } = wlt
                return (
                    <tr key={index}>
                        <td>{name}</td>
                        <td>{price}</td>
                    </tr>
                )
            })
        } else {
            return (<tr></tr>)
        }
    }
    renderWalletCards() {
        if(this.state.displayDexs) {
            return this.state.displayDexs.map((dex, index) => {
                if(dex.detail) {
                    return (
                        <Row key={index}>
                            <Col md="12">
                                <Card>
                                <CardHeader>
                                    <CardTitle tag="h4" className="no-margin-bottom" style={{color: dex.detail.color}}>{dex.detail.name}</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Table responsive>
                                    <thead className="text-primary">
                                        <tr>
                                        <th>Name</th>
                                        <th>Value</th>
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
                {this.renderWalletCards()}
            </div>
        </>
        );
    }
}

export default IndexDexs;
