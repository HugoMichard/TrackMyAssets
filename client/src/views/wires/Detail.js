import React, { Component } from "react";
import APIService from "routers/apiservice";
import WireForm from "components/forms/WireForm";
import PageRejection from "services/PageRejection"

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col
} from "reactstrap";

class DetailWire extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            wir_id: this.props.match.params.wir_id,
            wire: {} 
        }
    }
    componentDidMount() {
        APIService.getWire(this.state.wir_id)
        .then(res => this.setState({ wire: res.data.wire }))
        .catch(err => PageRejection.reject(this.props, err.response.data.notif));
    }
    render() {
        return (
        <>
            <div className="content">
                <Row>
                    <Col md="12">
                    <Card>
                        <CardHeader>
                            <CardTitle tag="h4" className="no-margin-bottom">Wire Details</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <WireForm
                                {...this.props}
                                wir_id={this.state.wir_id}
                                execution_date={this.state.wire.execution_date}
                                amount={this.state.wire.amount}
                                target={this.state.wire.target}
                                isIn={this.state.wire.amount > 0}>
                            </WireForm>
                        </CardBody>
                    </Card>
                    </Col>
                </Row>
            </div>
        </>
        );
    }
}

export default DetailWire;
