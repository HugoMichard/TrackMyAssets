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

class IndexWires extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            wires: [],
            totalWired: 0
        }
    }
    searchForWires() {
        APIService.searchWires().then(res => { this.setState({ wires: res.data.wires }); });
        APIService.getWireSummary().then(res => { this.setState({ totalWired: res.data.totalWired }); });
    }
    componentDidMount() {
        this.searchForWires()
    }
    renderTableData() {
        return this.state.wires.map((wir, index) => {
            const { wir_id, execution_date, amount, target } = wir
            return (
                <tr key={index} onClick={() => window.location = "/app/wires/" + wir_id}>
                    <td>{execution_date}</td>
                    <td className={amount < 0 ? "redtext" : "greentext"}>{amount < 0 ? "Sent" : "Received"}</td>
                    <td className={amount < 0 ? "redtext" : "greentext"}>{amount}</td>
                    <td>{target}</td>
                    <td>
                        <i 
                            className="nc-icon nc-simple-remove" 
                            onClick={(e) => { e.stopPropagation(); APIService.deleteWire(wir_id).then(() => this.searchForWires()); }} />
                    </td>
                </tr>
            )
        })
    }
    render() {
        const { totalWired } = this.state
        return (
        <>
            <div className="content">
            <Row>
                <Col lg="3" md="6" sm="6">
                <Card className="card-stats">
                    <CardBody>
                    <Row className={`${totalWired >= 0 ? "text-success" : "text-danger"}`}>
                        <Col md="7" xs="7">
                        <div className="text-center numbers">
                            <CardTitle tag="p">
                            {totalWired > 0 ? "+ " : totalWired < 0 ? "- " : ""}
                            {Math.round(Math.abs(totalWired) * 10) / 10}
                            </CardTitle>
                            <p />
                        </div>
                        </Col>
                    </Row>
                    </CardBody>
                    <CardFooter>
                    <hr />
                    <div className="stats">
                        <i className="far fa-clock" /> Total Wired
                    </div>
                    </CardFooter>
                </Card>
                </Col>
            </Row>
            <Row>
                <Col md="12">
                <Card>
                    <CardHeader>
                        <CardTitle tag="h4" className="no-margin-bottom">Wires</CardTitle>
                    </CardHeader>
                    <CardBody>
                    <Link to="/app/wires/create">
                        <Button
                            className="btn-round justify-content-end no-margin-top"
                            color="primary">
                                Create
                        </Button>
                    </Link>
                    <Table responsive>
                        <thead className="text-primary">
                        <tr>
                            <th>Date</th>
                            <th>Sent/Received</th>
                            <th>Amount</th>
                            <th>Wire Target</th>
                            <th>Delete</th>
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

export default IndexWires;
