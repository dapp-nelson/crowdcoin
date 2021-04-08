import { Button, Form, Input, Message } from "semantic-ui-react";
import Campaign from '../ethereum/campaign';
const { Component } = require("react");
import web3 from '../ethereum/web3';
import {Router} from '../routes';

class ContributeForm extends Component {
    state = {
        value: '',
        errorMessage: '',
        loading: false
    }

    onSubmit = async (event) => {
        event.preventDefault();
        const contract = Campaign(this.props.address);

        this.setState({ loading: true, errorMessage: '' });

        try{
            const accounts = await web3.eth.getAccounts();
            await contract.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(this.state.value, 'ether')
            });

            Router.replaceRoute(`/campaigns/${this.props.address}`);
        }catch(err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false, value: '' });
        
    }

    render() {
        return (
            <Form onSubmit={this.onSubmit} error={this.state.errorMessage != ''}>
                <Form.Field>
                    <label>Total para contribuir</label>
                    <Input value={this.state.value} 
                            onChange={event => this.setState({value: event.target.value})} 
                            label="ether" labelPosition="right"/>
                </Form.Field>

                <Message error header="Oops" content={this.state.errorMessage}/>

                <Button primary loading={this.state.loading}>Contribuir</Button>
            </Form>
        )
    }
}

export default ContributeForm;