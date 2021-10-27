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

class IndexAssets extends Component {
    constructor(props) {
        super(props);
        const typeValueToLabel = {
            stock: "Stock Asset",
            crypto: "Cryptocurrency",
            fix: "Fixed Price Asset"
        }
        this.state = { 
            assets: [],
            searchName: "",
            typeValueToLabel: typeValueToLabel
        }
        this.searchAssets = this.searchAssets.bind(this)
    }
    componentDidMount() {
        this.searchAssets(this.state.searchName);
    }
    searchAssets(searchName) {
        APIService.searchAssets({name: searchName}).then(res => { this.setState({ assets: res.data.assets });});
    }
    renderTableData() {
        return this.state.assets.map((ast, index) => {
            const { ast_id, name, cat_name, cat_color, code, ast_type } = ast
            return (
                <tr key={index} onClick={() => window.location = "/assets/" + ast_id}>
                    <td>{name}</td>
                    <td>{this.state.typeValueToLabel[ast_type]}</td>
                    <td>{ast_type !== "fix" ? code : ""}</td>
                    <td style={{
                        color: cat_color
                        }}>{cat_name}</td>
                    <td>
                        <i 
                            className="nc-icon nc-simple-remove" 
                            onClick={(e) => { e.stopPropagation(); window.location = "/assets/delete/" + ast_id }} />
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
                    <DebounceSearch searchFunction={this.searchAssets.bind(this)}/>
                    <Table responsive>
                        <thead className="text-primary">
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Ticker / Coin</th>
                            <th>Category</th>
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

export default IndexAssets;
