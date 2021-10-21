import React, { Component } from "react";
import APIService from "routers/apiservice";
import { Link } from "react-router-dom";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
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
            wires: []
        }
    }
    searchForWires() {
        APIService.searchWires().then(res => { this.setState({ wires: res.data.wires }); });
    }
    componentDidMount() {
        this.searchForWires()
    }
    renderTableData() {
        return this.state.wires.map((wir, index) => {
            const { wir_id, execution_date, amount, target } = wir
            return (
                <tr key={index} onClick={() => window.location = "/wires/" + wir_id}>
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
        return (
        <>
            <div className="content">
            <Row>
                <Col md="12">
                <Card>
                    <CardHeader>
                        <CardTitle tag="h4" className="no-margin-bottom">Wires</CardTitle>
                    </CardHeader>
                    <CardBody>
                    <Link to="/wires/create">
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
