import React, { Component } from "react";
import Select from 'react-select';
import APIService from "routers/apiservice";
import { Collapse } from 'react-collapse';
import ValidateUploadOrder from "components/tables/ValidateUploadOrder";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  FormGroup,
  Input,
  Form,
  Button
} from "reactstrap";

class ImportOrder extends Component {
    constructor(props) {
        super(props);
        const form = {
            name: "",
            execution_date: "",
            price: "",
            quantity: "",
            fees: "",
            plt_id: "",
            date_format: "yyyy/mm/dd",
            is_unit: true
        };
        const dateFormats = [
            {value: "yyyy/mm/dd", label: "yyyy / mm / dd"},
            {value: "dd/mm/yyyy", label: "dd / mm / yyyy"},
            {value: "mm/dd/yyyy", label: "mm / dd / yyyy"}
        ];
        const unitOrTotal = [
            {value: true, label: "Unit Price"},
            {value: false, label: "Total Price"}
        ]
        const selectedDateFormat = {value: "yyyy/mm/dd", label: "yyyy / mm / dd"}
        const selectedUnitOrTotal = {value: true, label: "Unit Price"}
        this.state = {
            redirect:false, 
            form: form, 
            selectedPlt: null, 
            receivedProps: null, 
            selectedFile: null, 
            selectedDateFormat: selectedDateFormat, 
            selectedFilename: "Choose a file", 
            dateFormats: dateFormats, 
            unitOrTotal: unitOrTotal, 
            selectedUnitOrTotal: selectedUnitOrTotal ,
            isUploadOpened: true,
            isValidationHidden: true,
            orders: []
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.collapseUpload = this.collapseUpload.bind(this);
        this.hideValidation = this.hideValidation.bind(this);
    }
    handleChange(property, event) {
        var { form, selectedPlt, selectedDateFormat, selectedUnitOrTotal } = this.state;
        form[property] = property === "plt_id" || property === "date_format" || property === "is_unit" ? event.value : event.target.value;

        if(property === "plt_id") {
            selectedPlt = event;
        }
        if(property === "date_format") {
            selectedDateFormat = event;
        }
        if(property === "is_unit") {
            selectedUnitOrTotal = event;
        }
        this.setState({form: form, selectedPlt: selectedPlt, selectedDateFormat: selectedDateFormat, selectedUnitOrTotal: selectedUnitOrTotal});
    }
    handleSubmit(e) {
        e.preventDefault();
        const { form, selectedFile } = this.state
        var formData = new FormData();
        formData.append( 
            "csvfile",
            selectedFile
        );
        Object.keys(form).forEach(k => {
            formData.append(k, form[k])
        })
        APIService.uploadOrderCsv(formData).then(res => this.setState({ orders: res.data.orders, isValidationHidden: false, isUploadOpened: false }));
    }
    componentDidMount() {
        APIService.searchPlatforms({}).then(res => { 
            const platforms = res.data.platforms.map(({
                plt_id: value,
                name: label,
                ...rest
              }) => ({
                value,
                label,
                ...rest
              }));
            var selectedPlt = {}
            if(this.state.form.plt_id) {
                for(var j in platforms){
                    if(platforms[j].value === this.state.form.plt_id){
                        selectedPlt = platforms[j];
                        break;
                    }
                }
            }
            this.setState({ platforms: platforms, selectedPlt: selectedPlt });
        });
    }
    handleFileUpload(e) {
        var fileName = e.target.value.split( '\\' ).pop();
        if(fileName.length < 3) {
            fileName = "Choose a file"
        }
        this.setState({ selectedFilename: fileName, selectedFile: e.target.files[0] })
    }
    collapseUpload() {
        this.setState({ isUploadOpened: !this.state.isUploadOpened })
    }
    hideValidation() {
        this.setState({ isValidationHidden: !this.state.isValidationHidden })
    }
    render() {
        const { form, platforms, selectedPlt, selectedFilename, dateFormats, selectedDateFormat, unitOrTotal, selectedUnitOrTotal, isUploadOpened, isValidationHidden, orders } = this.state;
        return (
        <>
            <div className="content">
            <Row>
                <Col md="12">

                <Card>
                    <CardHeader onClick={this.collapseUpload} className="pointer">
                        <CardTitle tag="h4" className="flex-display">
                            <span className="flex-break">Import CSV with Orders</span>
                            { isUploadOpened ?
                                <i class="nc-icon nc-minimal-up"></i>
                                : <i class="nc-icon nc-minimal-down"></i>
                            }
                        </CardTitle>
                    </CardHeader>
                    <Collapse isOpened={isUploadOpened}>
                        <CardBody>
                            <p className="blockquote blockquote-danger">
                                <strong>Formatting tips for the CSV file : </strong> <br />
                                - <strong>Headers</strong>: should be on the first row of the CSV, and start in column A. The header names don't matter but shouldn't be empty and should be different from each other <br/>
                                - <strong>Rows</strong>: should start on the second row of the CSV. Parsing will stop as soon as an empty row is found <br />
                                - <strong>Form</strong>: in the form below, please indicate the column letter that contains the values (if the execution date of the orders are in column A, precise A in the field 'Column with execution date')
                            </p>
                            <Form>
                                <Row>
                                    <Col>
                                        <FormGroup>
                                            <Input type="file" name="file-1[]" id="file-1" className="inputfile inputfile-1" hidden onChange={this.handleFileUpload} />
                                            <label for="file-1"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"/></svg> <span>{selectedFilename}</span></label>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="6">
                                        <FormGroup>
                                            <label>Platform</label>
                                            <Select options={platforms} onChange={(evt) => this.handleChange("plt_id", evt)} value={selectedPlt}></Select>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="6">
                                        <FormGroup>
                                            <label>Execution date format</label>
                                            <Select options={dateFormats} onChange={(evt) => this.handleChange("date_format", evt)} value={selectedDateFormat}></Select>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6">
                                        <FormGroup>
                                            <label>Column with execution date</label>
                                            <Input
                                                placeholder="Column letter"
                                                type="text"
                                                onChange={(evt) => this.handleChange("execution_date", evt)}
                                                value={form.execution_date}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="6">
                                        <FormGroup>
                                            <label>Unit or Total Price</label>
                                            <Select options={unitOrTotal} onChange={(evt) => this.handleChange("is_unit", evt)} value={selectedUnitOrTotal}></Select>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6">
                                        <FormGroup>
                                            <label>Price</label>
                                            <Input
                                                placeholder="Column letter"
                                                type="text"
                                                onChange={(evt) => this.handleChange("price", evt)}
                                                value={form.price}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="2">
                                        <FormGroup>
                                            <label>Column with asset name</label>
                                            <Input 
                                                placeholder="Column letter" 
                                                type="text" 
                                                onChange={(evt) => this.handleChange("name", evt)}
                                                value={form.name}
                                            />
                                        </FormGroup>
                                    </Col>

                                    <Col md="2">
                                        <FormGroup>
                                            <label>Column with quantity</label>
                                            <Input
                                                placeholder="Column letter" 
                                                type="text" 
                                                onChange={(evt) => this.handleChange("quantity", evt)}
                                                value={form.quantity}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md="2">
                                        <FormGroup>
                                            <label>Column with fees (optional)</label>
                                            <Input
                                                placeholder="Column letter" 
                                                type="text" 
                                                onChange={(evt) => this.handleChange("fees", evt)}
                                                value={form.fees}
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
                                            Upload
                                        </Button>
                                    </div>
                                </Row>
                            </Form>
                        </CardBody>
                    </Collapse>
                </Card>
                <ValidateUploadOrder
                    {...this.props}
                    isHidden={isValidationHidden}
                    orders={orders}
                >
                </ValidateUploadOrder>
                </Col>
            </Row>
            </div>
        </>
        );
    }
}

export default ImportOrder;
