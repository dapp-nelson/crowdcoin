import React, { Component } from 'react';
import { Button, Card, Grid } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import { Link } from '../../routes';

class CampaignShow extends Component {

    static async getInitialProps(props) {
        const contract = Campaign(props.query.address);

        const summary = await contract.methods.getSummary().call();

        return {
            minimumContribution: summary.minimum,
            balance: summary.balance,
            requestsCount: summary.requestsSize,
            approversCount: summary.approversSize,
            manager: summary.managerAdress,
            address: props.query.address
        };
    }

    renderCards() {
        const {
            balance,
            manager,
            minimumContribution,
            requestsCount,
            approversCount
        } = this.props

        const items = [
            {
                header: manager,
                meta: "Address do Gerente",
                description: "O gerente criou esta campanha e pode criar solicitações de saque de dinheiro.",
                style: {overflowWrap: 'break-word'}
            },
            {
                header: minimumContribution,
                meta: "Contribuição mínima (wei)",
                description: "O valor mínimo em wei que você deve contribuir para participar da campanha e se tornar um aprovador."
            },
            {
                header: requestsCount,
                meta: "Número de solicitações",
                description: "Uma solicitação retira dinheiro do contrato. As solicitações devem ser aprovadas pelos aprovadores."
            },
            {
                header: approversCount,
                meta: "Número de aprovadores",
                description: "Número de pessoas que já doaram para esta campanha."
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: "Saldo da campanha (ether)",
                description: "O saldo é quanto dinheiro esta campanha ainda tem para gastar."
            }
        ];

        return <Card.Group items={items}></Card.Group>
    }

    render () {
        return (
            <Layout>
                <h3>Campanha</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            {this.renderCards()}
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <ContributeForm address={this.props.address}/>
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/campaigns/${this.props.address}/requests`}>
                                <a>
                                    <Button primary>Visualizar solicitações</Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    }
}

export default CampaignShow;