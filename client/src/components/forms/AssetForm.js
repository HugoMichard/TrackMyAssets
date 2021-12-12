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

import DebounceSelect from "components/custom/debounce-select"

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
        this.state = { 
            redirect: false, 
            form: form, 
            categories: {}, 
            selectedType: null, 
            selectedCat: null, 
            typeOptions: typeOptions, 
            selectedPlt: null, 
            platforms: {}, 
            coins: {}, 
            selectedCoin: {} 
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.searchCoins = this.searchCoins.bind(this)
    }
    componentWillReceiveProps(nextProps) {
        const { categories, platforms, typeOptions, coins } = this.state;
        const form = {
            name: nextProps.name,
            ast_type: nextProps.ast_type,
            cat_id: nextProps.cat_id,
            ticker: nextProps.code,
            coin: nextProps.code,
            ast_id: nextProps.ast_id,
            plt_id: nextProps.plt_id,
            fix_vl: nextProps.fix_vl,
            cmc_id: nextProps.cmc_id,
            duplicate_nbr: nextProps.duplicate_nbr
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
        var selectedCoin = {}
        for(var k in coins){
            if(coins[k].value === form.cmc_id){
                selectedCoin = coins[k];
                break;
            }
        }
        this.setState({form: form, selectedType: selectedType, selectedCat: selectedCat, selectedPlt: selectedPlt, selectedCoin: selectedCoin})
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
        this.searchCoins("");
    }
    handleChange(property, event) {
        var { form, selectedType, selectedCat, selectedPlt, selectedCoin } = this.state;
        form[property] = property === "ast_type" || property === "cat_id" || property === "plt_id" || property === "cmc_id"  ? event.value : event.target.value;
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
        if(property === "cmc_id") {
            selectedCoin = event;
            form.coin = selectedCoin.symbol;
            form.duplicate_nbr = selectedCoin.duplicate_nbr;
            form.cmc_official_id = selectedCoin.cmc_official_id;
        }

        if(form.ast_type !== "dex") {
            selectedPlt = null;
            form.plt_id = null;
        }
        if(form.ast_type !== "crypto") {
            selectedCoin = null;
            form.cmc_id = null;
            form.coin = null;
            form.duplicate_nbr = null;
            form.cmc_official_id = null;
        }
        this.setState({form: form, selectedCat: selectedCat, selectedType: selectedType, selectedPlt: selectedPlt, selectedCoin: selectedCoin});
    }
    
    handleSubmit(e){
        const updateOrCreateAsset = this.state.form.ast_id !== undefined ? APIService.updateAsset.bind(APIService) : APIService.createAsset.bind(APIService)

        updateOrCreateAsset(this.state.form).then(res => {
            this.props.displayNotification(this.props.notify, res.data.notif.text, res.data.notif.color);
            this.setState({redirect: res.status === 200});
        }).catch(err => this.props.displayNotification(this.props.notify, err.response.data.notif.text, err.response.data.notif.color));
    }
    searchCoins(searchName) {
        APIService.searchCoins({name: searchName}).then(res => { 
            var coins = res.data.coins.map(({
                cmc_id: value,
                name: label,
                ...rest
              }) => ({
                value,
                label,
                ...rest
            }));
            coins = coins.map(c => {
                return {
                    value: c.value,
                    label: c.label + " (" + c.symbol + ")",
                    symbol: c.symbol,
                    duplicate_nbr: c.duplicate_nbr,
                    cmc_official_id: c.cmc_official_id
                }
            })
            this.setState({ coins: coins });
        });
    }
    nameField(size) {
        return (
            <Col md={size.toString()}>
                <FormGroup>
                    <label>Name</label>
                    <Input 
                        placeholder="Name" 
                        type="text" 
                        onChange={(evt) => this.handleChange("name", evt)}
                        value={this.state.form.name}
                    />
                </FormGroup>
            </Col>
        )
    }
    render() {
        let { typeOptions, selectedType, selectedCat, selectedCoin, categories, form, platforms, selectedPlt, coins } = this.state
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
                {form.ast_type === "stock" ? 
                    <Row>
                        {this.nameField(6)}
                        <Col md="6">
                            <FormGroup>
                                <label>Ticker Code</label>
                                <Input
                                    placeholder="Ticker"
                                    type="text"
                                    onChange={(evt) => this.handleChange("ticker", evt)}
                                    value={form.ticker}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                : form.ast_type === "crypto" ?
                    <Row>
                        {this.nameField(4)}
                        <Col md="4">
                            <FormGroup>
                                <label>Cryptocurrency token</label>
                                <DebounceSelect 
                                    options={coins} 
                                    handleChange={this.handleChange.bind(this)}
                                    changeElementName={"cmc_id"}
                                    searchFunction={this.searchCoins.bind(this)}
                                    selectedValue={selectedCoin}
                                    debounceTime={100}>
                                </DebounceSelect>
                            </FormGroup>
                        </Col>
                        <Col md="4">
                            <FormGroup>
                                <div>                            
                                    <label>Coin Code</label>
                                    <p>{selectedCoin ? selectedCoin.symbol : ""}</p>
                                </div>
                            </FormGroup>
                        </Col>
                    </Row>
                : form.ast_type === "fix" ?
                    <Row>
                        {this.nameField(6)}
                        <Col md="6">
                            <FormGroup>
                                <label>Fixed Value</label>
                                <Input
                                    placeholder="Value"
                                    type="text"
                                    onChange={(evt) => this.handleChange("fix_vl", evt)}
                                    value={form.fix_vl}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                : <Row>
                        {this.nameField(6)}
                        <Col md="6">
                            <FormGroup>
                                <label>Platform</label>
                                <Select options={platforms} onChange={(evt) => this.handleChange("plt_id", evt)} value={selectedPlt}></Select>
                            </FormGroup>
                        </Col>
                    </Row>
                }
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
            {this.state.redirect ? <Redirect to="/app/assets"/> : ""}
            </Form>
        </>
        );
    }
}

export default AssetForm;
