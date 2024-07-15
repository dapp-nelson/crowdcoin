import { useState } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import {Router} from '../routes';

const ContributeForm = ({ address }) => {
    const [value, setValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const validateInput = () => {
        const amount = parseFloat(value);
        if (isNaN(amount) || amount <= 0) {
            setErrorMessage('Por favor, insira um valor válido maior que zero');
            return false;
        }
        return true;
    }

    const contributeToCampaign = async () => {
        const contract = Campaign(address);
        try{
            const accounts = await web3.eth.getAccounts();
            await contract.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(value, 'ether')
            });
            Router.replaceRoute(`/campaigns/${address}`);
        }catch(err) {
            setErrorMessage(err.message);
        }
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        if (!validateInput()) {
            return;
        }
        setLoading(true);
        setErrorMessage('');
        await contributeToCampaign();
        setLoading(false);
        setValue('');
    }

    return (
        <Form onSubmit={onSubmit} error={!!errorMessage}>
            <Form.Field>
                <label>Total para contribuir</label>
                <Input value={value}
                       onChange={event => setValue(event.target.value)}
                       label="ether" labelPosition="right"/>
            </Form.Field>

            {errorMessage && <Message error header="Oops" content={errorMessage}/>}

            <Button primary loading={loading}>Contribuir</Button>
        </Form>
    )
}

export default ContributeForm;
