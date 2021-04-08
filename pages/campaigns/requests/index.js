import React, { Component } from 'react';
import { Button, Table } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import { Link } from '../../../routes';
import Campaign from  '../../../ethereum/campaign';
import RequestRow from '../../../components/RequestRow';

class RequestIndex extends Component {
    static async getInitialProps(props) {
        const { address } = props.query;

        const contract = Campaign(address);
        const allRequests = await contract.methods.getAllRequests().call();
        const requestCount = await contract.methods.getRequestsCount().call();
        const approversCount = await contract.methods.approversCount().call();

        const requests = allRequests.map(element => {
            return {
                approvalCount: element.approvalCount,
                complete: element.complete,
                description: element.description,
                recipient: element.recipient,
                value: element.value
            }
        });

        return{ address, requests, requestCount, approversCount };
    }

    renderRows() {
        return this.props.requests.map((request, index) => {
            return <RequestRow id={index} request={request} address={this.props.address} approversCount={this.props.approversCount}/>
        })
    }

    render() {
        const { Header, Row, HeaderCell, Body} = Table;

        return(
            <Layout>
                <h3>Solicitações</h3>
                <Link route={`/campaigns/${this.props.address}/requests/new`}>
                    <a>
                        <Button primary floated="right" style={{marginBottom: 10}}>Adicionar Solicitação</Button>
                    </a>
                </Link>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Descrição</HeaderCell>
                            <HeaderCell>Total</HeaderCell>
                            <HeaderCell>Fornecedor</HeaderCell>
                            <HeaderCell>Qtde. aprovação</HeaderCell>
                            <HeaderCell>Aprovar</HeaderCell>
                            <HeaderCell>Finalizar</HeaderCell>
                        </Row>
                    </Header>
                    <Body>{this.renderRows()}</Body>
                </Table>
                <div>Encontrada {this.props.requestCount} solicitações</div>
            </Layout>
        );
    }
}

export default RequestIndex;