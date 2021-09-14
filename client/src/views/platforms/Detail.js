import React, { Component } from "react";
import APIService from "routers/apiservice";
import PlatformForm from "components/forms/PlatformForm";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col
} from "reactstrap";

class DetailPlatform extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            plt_id: this.props.match.params.plt_id,
            platform: {} }
    }
    componentDidMount() {
        APIService.getPlatform(this.state.plt_id).then(res => { console.log(res.data);this.setState({platform: res.data.platform });});
    }
    render() {
        return (
        <>
            <div className="content">
            <Row>
                <Col md="12">
                <Card>
                    <CardHeader>
                        <CardTitle tag="h4" className="no-margin-bottom">Platform Details</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <PlatformForm
                            {...this.props}
                            name={this.state.platform.name}
                            color={this.state.platform.color}
                            plt_id={this.state.plt_id}>
                        </PlatformForm>
                    </CardBody>
                </Card>
                </Col>
            </Row>
            </div>
        </>
        );
    }
}

export default DetailPlatform;
