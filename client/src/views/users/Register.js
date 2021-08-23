import React, {Component} from "react";
import APIService from 'routers/apiservice'

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


class Register extends Component {
  constructor(props) {
    super(props);
    var form = {
      "firstname": "",
      "lastname": "",
      "email": "",
      "password": "",
      "password_confirmation": ""
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
    APIService.register(this.state.form).then(result => { 
      console.log(result);
      if(result === "Success") { window.location = "/login" }
      else { window.location = "/register" }
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
                  <CardTitle tag="h5" className="center-text">Register</CardTitle>
                </CardHeader>
                <CardBody>
                  <Form>
                    <Row>
                      <Col className="pr-1" md="6">
                        <FormGroup>
                          <label>First Name</label>
                          <Input
                            placeholder="First Name"
                            type="text"
                            onChange={(evt) => this.handleChange("firstname", evt)}
                          />
                        </FormGroup>
                      </Col>
                      <Col className="pl-1" md="6">
                        <FormGroup>
                          <label>Last Name</label>
                          <Input
                            placeholder="Last Name"
                            type="text"
                            onChange={(evt) => this.handleChange("lastname", evt)}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
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
                      <Col className="pr-1" md="6">
                        <FormGroup>
                          <label>Password</label>
                          <Input
                            placeholder="Password"
                            type="password"
                            onChange={(evt) => this.handleChange("password", evt)}
                          />
                        </FormGroup>
                      </Col>
                      <Col className="pl-1" md="6">
                        <FormGroup>
                          <label>Confirm password</label>
                          <Input
                            placeholder="Confirmation"
                            type="password"
                            onChange={(evt) => this.handleChange("password_confirmation", evt)}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <div className="update ml-auto mr-auto">
                        <Button
                          className="btn-round"
                          color="primary"
                          onClick={this.handleSubmit}
                        >
                          Register
                        </Button>
                      </div>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Register;
