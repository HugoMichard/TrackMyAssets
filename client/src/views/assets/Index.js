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
        APIService.searchAsset(this.state.searchForm).then(res => { this.setState({ assets: res.data.assets }); console.log(this.state.assets)});
    }
    renderTableData() {
        return this.state.assets.map((cat, index) => {
            const { ast_id, name, cat_name, cat_color, isin, coin, type } = cat
            const code = type === "stock" ? isin : coin;
            return (
                <tr key={index} onClick={() => window.location = "/assets/" + ast_id}>
                    <td>{name}</td>
                    <td>{type}</td>
                    <td>{code}</td>
                    <td style={{
                        color: cat_color
                        }}>{cat_name}</td>
                    <td>
                        <i className="nc-icon nc-simple-remove" onClick={(e) => { e.stopPropagation(); console.log("coucou"); }} />
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
                    <Table>
                        <thead className="text-primary">
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>ISIN / Coin</th>
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
