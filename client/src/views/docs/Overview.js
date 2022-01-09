import React, {Component} from "react";

// reactstrap components
import {
    Card,
    CardBody,
    Row,
    Col
  } from "reactstrap";

export default class DocOverview extends Component {
  render() {
    return (
        <>
        <div className="content">
            <Row>
                <Col md="12">
                    <Card>
                        <CardBody>
                            <h2>Introduction</h2>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
      </>
    );
  }
}
