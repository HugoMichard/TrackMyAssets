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

import DebounceSearch from "components/custom/search"

class IndexPlatforms extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            platforms: []
        }
        this.searchPlatforms = this.searchPlatforms.bind(this)
    }
    componentDidMount() {
        this.searchPlatforms("");
    }
    searchPlatforms(searchName) {
        APIService.searchPlatforms({name: searchName}).then(res => { this.setState({ platforms: res.data.platforms });});
    }
    renderTableData() {
        return this.state.platforms.map((plf, index) => {
            const { plt_id, name, color, dex_name } = plf
            return (
                <tr key={index} onClick={() => window.location = "/app/platforms/" + plt_id}>
                    <td>{name}</td>
                    <td>{dex_name}</td>
                    <td style={{
                        color: color,
                        backgroundColor: color
                        }}>
                            {color}
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
                        <CardTitle tag="h4" className="no-margin-bottom">Platforms</CardTitle>
                    </CardHeader>
                    <CardBody>
                    <Link to="/app/platforms/create">
                        <Button
                            className="btn-round justify-content-end no-margin-top"
                            color="primary">
                                Add
                        </Button>
                    </Link>
                    <DebounceSearch searchFunction={this.searchPlatforms.bind(this)}/>
                    <Table>
                        <thead className="text-primary">
                        <tr>
                            <th>Name</th>
                            <th>DEX</th>
                            <th>Color</th>
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

export default IndexPlatforms;
