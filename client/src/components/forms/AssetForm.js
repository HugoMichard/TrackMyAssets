import React, { Component } from "react";
import APIService from "routers/apiservice";
import Select from 'react-select'
import { Redirect } from "react-router";

// reactstrap components
import {
  Input,
  FormGroup,
  Form,
  Row,
  Col,
  Button
} from "reactstrap";

class AssetForm extends Component {
    constructor(props) {
        super(props);
        const form = {
            name: "",
            ast_type: "stock",
            ticker: "",
            coin: "",
            cat_id: ""
        }
        const typeOptions = [
            { value: 'stock', label: 'Stock Asset' },
            { value: 'crypto', label: 'Cryptocurrency' },
            { value: 'fix', label: 'Fixed Price Asset' },
            { value: 'dex', label: 'DEX LP Token' }
        ]
        this.state = { redirect: false, form: form, categories: {}, selectedType: null, selectedCat: null, typeOptions: typeOptions, selectedPlt: null, platforms: {} }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        const { categories, platforms, typeOptions } = this.state;
        const form = {
            name: nextProps.name,
            ast_type: nextProps.ast_type,
            cat_id: nextProps.cat_id,
            ticker: nextProps.code,
            coin: nextProps.code,
            ast_id: nextProps.ast_id,
            plt_id: nextProps.plt_id,
            fix_vl: nextProps.fix_vl
        }
        const selectedType = form.ast_type === "stock" ? typeOptions[0] 
            : form.ast_type === "crypto" ? typeOptions[1] 
            : form.ast_type === "fix" ? typeOptions[2]
            : typeOptions[3];
        var selectedCat = {}
        for(var i in categories){
            if(categories[i].value === form.cat_id){
                selectedCat = categories[i];
                break;
            }
        }
        var selectedPlt = {}
        for(var j in platforms){
            if(platforms[j].value === form.plt_id){
                selectedPlt = platforms[j];
                break;
            }
        }
        this.setState({form: form, selectedType: selectedType, selectedCat: selectedCat, selectedPlt: selectedPlt})
    }
    componentDidMount() {
        APIService.searchCategories({}).then(res => { 
            const categories = res.data.categories.map(({
                cat_id: value,
                name: label,
                ...rest
              }) => ({
                value,
                label,
                ...rest
            }));
            this.setState({categories: categories });
        });

        APIService.searchPlatformDexs({}).then(res => { 
            const platforms = res.data.dexs.map(({
                plt_id: value,
                name: label,
                ...rest
              }) => ({
                value,
                label,
                ...rest
            }));
            this.setState({ platforms: platforms });
        });
    }
    handleChange(property, event) {
        var { form, selectedType, selectedCat, selectedPlt } = this.state;
        form[property] = property === "ast_type" || property === "cat_id" || property === "plt_id" ? event.value : event.target.value;
        if(property === "ast_type") {
            selectedType = event
        }
        if(property === "cat_id") {
            selectedCat = event
        }
        if(property === "plt_id") {
            selectedPlt = event;
            form.fix_vl = 0;
        }

        if(form.ast_type !== "dex") {
            selectedPlt = null;
            form.plt_id = null;
        }
        this.setState({form: form, selectedCat: selectedCat, selectedType: selectedType, selectedPlt: selectedPlt});
    }
    
    handleSubmit(e){
        const updateOrCreateAsset = this.state.form.ast_id !== undefined ? APIService.updateAsset.bind(APIService) : APIService.createAsset.bind(APIService)

        updateOrCreateAsset(this.state.form).then(res => {
            this.props.displayNotification(this.props.notify, res.data.notif.text, res.data.notif.color);
            this.setState({redirect: res.status === 200});
        }).catch(err => this.props.displayNotification(this.props.notify, err.response.data.notif.text, err.response.data.notif.color));
    }
    
    assetIdentifier() {
        if(this.state.form.ast_type === "stock") {
            return (
                <div>                            
                    <label>Ticker Code</label>
                    <Input
                        placeholder="Ticker"
                        type="text"
                        onChange={(evt) => this.handleChange("ticker", evt)}
                        value={this.state.form.ticker}
                    />
                </div>
            );
        } else {
            if(this.state.form.ast_type === "crypto") {
                return (
                    <div>                            
                        <label>Coin Code</label>
                        <Input
                            placeholder="Coin"
                            type="text"
                            onChange={(evt) => this.handleChange("coin", evt)}
                            value={this.state.form.coin}
                        />
                    </div>
                );
            } else {
                if(this.state.form.ast_type === "dex") {
                    return (
                    <div>
                        <label>Platform</label>
                         <Select options={this.state.platforms} onChange={(evt) => this.handleChange("plt_id", evt)} value={this.state.selectedPlt}></Select>
                    </div>)
                } else {
                    return (
                        <div>                            
                            <label>Fixed Value</label>
                            <Input
                                placeholder="Value"
                                type="text"
                                onChange={(evt) => this.handleChange("fix_vl", evt)}
                                value={this.state.form.fix_vl}
                            />
                        </div>
                    )
                }
            }
        }
    }
    render() {
        let { typeOptions, selectedType, selectedCat, categories, form } = this.state
        let submitText = form.ast_id === undefined ? "Create" : "Update"; 
        return (
        <>
            <Form>
                <Row>
                    <Col md="6">
                        <FormGroup>
                            <label>Type</label>
                            <Select options={typeOptions} onChange={(evt) => this.handleChange("ast_type", evt)} value={selectedType}>
                            </Select>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            <label>Category</label>
                            <Select options={categories} onChange={(evt) => this.handleChange("cat_id", evt)} value={selectedCat}></Select>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md="6">
                        <FormGroup>
                            <label>Name</label>
                            <Input 
                                placeholder="Name" 
                                type="text" 
                                onChange={(evt) => this.handleChange("name", evt)}
                                value={form.name}
                            />
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            {this.assetIdentifier()}
                        </FormGroup>
                    </Col>
                </Row>
                {this.props.noSubmitButton ? "" :
                    <Row>
                        <div className="update ml-auto mr-auto">
                            <Button
                                className="btn-round"
                                color="primary"
                                onClick={this.handleSubmit}
                            >
                                {submitText}
                            </Button>
                        </div>
                    </Row>
                }
            {this.state.redirect ? <Redirect to="/assets"/> : ""}
            </Form>
        </>
        );
    }
}

export default AssetForm;
