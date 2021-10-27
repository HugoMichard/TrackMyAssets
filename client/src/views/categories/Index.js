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

class IndexCategories extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            categories: []
        }
        this.searchCategories = this.searchCategories.bind(this)
    }
    componentDidMount() {
        this.searchCategories("");
    }
    searchCategories(searchName) {
        APIService.searchCategories({name: searchName}).then(res => { this.setState({ categories: res.data.categories });});
    }
    renderTableData() {
        return this.state.categories.map((cat, index) => {
            const { cat_id, name, color } = cat
            return (
                <tr key={index} onClick={() => window.location = "/categories/" + cat_id}>
                    <td>{name}</td>
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
                        <CardTitle tag="h4" className="no-margin-bottom">Categories</CardTitle>
                    </CardHeader>
                    <CardBody>
                    <Link to="/categories/create">
                        <Button
                            className="btn-round justify-content-end no-margin-top"
                            color="primary">
                                Create
                        </Button>
                    </Link>
                    <DebounceSearch searchFunction={this.searchCategories.bind(this)}/>
                    <Table>
                        <thead className="text-primary">
                        <tr>
                            <th>Name</th>
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

export default IndexCategories;
