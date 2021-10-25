import React, {Component} from "react";
import AuthService from "services/auth";
import { Redirect } from "react-router";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";


export default class Login extends Component {
  constructor(props) {
    super(props);
    var form = {
      "email": "",
      "password": ""
    }
    this.state = { form: form };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(property, event) {
    var form = this.state.form;
    form[property] = event.target.value;
    this.setState({form: form});
  }

  handleSubmit(e){
    e.preventDefault();
    AuthService.login(this.state.form).then(res => {
      if(res.status === 200) { 
        this.setState({ redirectTo: "/dashboard" })
      }
      else { 
        this.props.displayNotification(this.props.notify, res.data.notif.text, res.data.notif.color);
      }
    });
  }

  render() {
    return (
      <>
        <div className="content">
          <Row className="center-row">
            <Col md="5">
              <Card className="card-user">
                <CardHeader>
                  <CardTitle tag="h5" className="center-text">Login</CardTitle>
                </CardHeader>
                <CardBody>
                  <Form>
                    <Row>
                      <Col md="12">
                      <FormGroup>
                          <label htmlFor="exampleInputEmail1">
                            Email address
                          </label>
                          <Input 
                            placeholder="Email" 
                            type="email" 
                            onChange={(evt) => this.handleChange("email", evt)}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12">
                        <FormGroup>
                          <label>Password</label>
                          <Input
                            placeholder="Password"
                            type="password"
                            onChange={(evt) => this.handleChange("password", evt)}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <div className="update ml-auto mr-auto">
                        <Button
                          className="btn-round"
                          color="primary"
                          type="submit"
                          onClick={this.handleSubmit}
                        >
                          Login
                        </Button>
                      </div>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {this.state.redirectTo ? <Redirect to={this.state.redirectTo}/> : ""}
        </div>
      </>
    );
  }
}
