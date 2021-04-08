import React, { Component } from 'react';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import { Link, Router } from '../../../routes';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import campaign from '../../../ethereum/campaign';

class RequestNew extends Component {
    state = {
        value: '',
        description: '',
        recipient: '',
        loading: false,
        errorMessage: ''
    };

    static async getInitialProps(props) {
        const { address } = props.query;
        return { address };
    }

    onSubmit = async (event) => {
        event.preventDefault();

        const contract = Campaign(this.props.address);
        const { description, value, recipient } = this.state;

        this.setState({ loading: true, errorMessage: '' });

        try {
            const accounts = await web3.eth.getAccounts();
            await contract.methods.createRequest(description, web3.utils.toWei(value, 'ether'), recipient).send({
                from: accounts[0]
            });

            Router.pushRoute(`/campaigns/${this.props.address}/requests`)
        }catch(err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false });
    }

    render() {
        return (
            <Layout>
                <Link route={`/campaigns/${this.props.address}/requests`}>
                    <a>Voltar</a>
                </Link>
                <h3>Criar solicitação</h3>
                <Form onSubmit={this.onSubmit} error={this.state.errorMessage != ''}>
                    <Form.Field>
                        <label>Descrição</label>
                        <Input value={this.state.description} onChange={event => this.setState({ description: event.target.value })}/>
                    </Form.Field>

                    <Form.Field>
                        <label>Valor (ether)</label>
                        <Input value={this.state.value} onChange={event => this.setState({ value: event.target.value })}/>

                    </Form.Field>

                    <Form.Field>
                        <label>Address do fornecedor</label>
                        <Input value={this.state.recipient} onChange={event => this.setState({ recipient: event.target.value })}/>
                    </Form.Field>

                    <Message error header="Oops" content={this.state.errorMessage}/>

                    <Button primary loading={this.state.loading}>Criar</Button>
                </Form>
            </Layout>
        );
            
    }
}

export default RequestNew;