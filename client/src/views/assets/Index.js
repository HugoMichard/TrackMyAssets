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

class IndexAssets extends Component {
    constructor(props) {
        super(props);
        const searchForm = {
            name: ""
        }
        this.state = { 
            assets: [],
            searchForm: searchForm
        }
    }
    componentDidMount() {
        APIService.searchAsset(this.state.searchForm).then(res => { console.log("j'ai bien cherché"); console.log(res); });
    }
    render() {
        return (
        <>
            <div className="content">
            <Row>
                <Col md="12">
                <Card>
                    <CardHeader>
                        <CardTitle tag="h4" className="no-margin-bottom">Assets</CardTitle>
                    </CardHeader>
                    <CardBody>
                    <Link to="/assets/create">
                        <Button
                            className="btn-round justify-content-end no-margin-top"
                            color="primary">
                                Create
                        </Button>
                    </Link>
                    <Table>
                        <thead className="text-primary">
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th className="text-right">Added on The</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Dakota Rice</td>
                            <td>Niger</td>
                            <td>Oud-Turnhout</td>
                        </tr>
                        <tr>
                            <td>Minerva Hooper</td>
                            <td>Curaçao</td>
                            <td>Sinaai-Waas</td>
                        </tr>
                        <tr>
                            <td>Sage Rodriguez</td>
                            <td>Netherlands</td>
                            <td>Baileux</td>
                        </tr>
                        <tr>
                            <td>Philip Chaney</td>
                            <td>Korea, South</td>
                            <td>Overland Park</td>
                        </tr>
                        <tr>
                            <td>Doris Greene</td>
                            <td>Malawi</td>
                            <td>Feldkirchen in Kärnten</td>
                        </tr>
                        <tr>
                            <td>Mason Porter</td>
                            <td>Chile</td>
                            <td>Gloucester</td>
                        </tr>
                        <tr>
                            <td>Jon Porter</td>
                            <td>Portugal</td>
                            <td>Gloucester</td>
                        </tr>
                        </tbody>
                    </Table>
                    </CardBody>
                </Card>
                </Col>
                <Col md="12">
                <Card className="card-plain">
                    <CardHeader>
                    <CardTitle tag="h4">Table on Plain Background</CardTitle>
                    <p className="card-category">
                        Here is a subtitle for this table
                    </p>
                    </CardHeader>
                    <CardBody>
                    <Table responsive>
                        <thead className="text-primary">
                        <tr>
                            <th>Name</th>
                            <th>Country</th>
                            <th>City</th>
                            <th className="text-right">Salary</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Dakota Rice</td>
                            <td>Niger</td>
                            <td>Oud-Turnhout</td>
                            <td className="text-right">$36,738</td>
                        </tr>
                        <tr>
                            <td>Minerva Hooper</td>
                            <td>Curaçao</td>
                            <td>Sinaai-Waas</td>
                            <td className="text-right">$23,789</td>
                        </tr>
                        <tr>
                            <td>Sage Rodriguez</td>
                            <td>Netherlands</td>
                            <td>Baileux</td>
                            <td className="text-right">$56,142</td>
                        </tr>
                        <tr>
                            <td>Philip Chaney</td>
                            <td>Korea, South</td>
                            <td>Overland Park</td>
                            <td className="text-right">$38,735</td>
                        </tr>
                        <tr>
                            <td>Doris Greene</td>
                            <td>Malawi</td>
                            <td>Feldkirchen in Kärnten</td>
                            <td className="text-right">$63,542</td>
                        </tr>
                        <tr>
                            <td>Mason Porter</td>
                            <td>Chile</td>
                            <td>Gloucester</td>
                            <td className="text-right">$78,615</td>
                        </tr>
                        <tr>
                            <td>Jon Porter</td>
                            <td>Portugal</td>
                            <td>Gloucester</td>
                            <td className="text-right">$98,615</td>
                        </tr>
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

export default IndexAssets;
