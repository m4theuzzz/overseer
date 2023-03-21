import React, { useState } from "react";
import * as S from "../styles";
import Button from "../../../components/Button";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "../../../hooks/useForm";
import Card from "../../../components/Card";
import { useServices } from "../../../hooks/useServices";
import { useEffect } from "react";
import TextField from "../../../components/TextField";

const EditBudgetForm = ({ id, executeAction }) => {
    const navigate = useNavigate();
    const { paramId } = useParams();
    const budgetId = id || paramId;

    const fieldsValidations = {};

    const [budget, setBudget] = useState();
    const [construction, setConstruction] = useState();

    const { values, setValues, formValidate, errors } = useForm(
        {
            client_id: "",
            name: "",
            incoming_margin: "",
            teams: "",
            address: {}
        },
        fieldsValidations
    );

    const fetchData = async () => {
        const bud = await useServices('budgets', 'GET', budgetId);
        const construct = await useServices('constructions', 'GET', bud.constructionId);

        setBudget(bud);
        setConstruction({ ...construct, incomingMargin: construct.incomingMargin * 100 });

        setValues({
            client_id: bud.clientId,
            name: bud.name,
            incoming_margin: construct.incomingMargin * 100,
            teams: construct.teams,
            address: construct.address
        });
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (prop, val) => {
        setValues({ ...values, [prop]: val });
    };

    const handleStatusChange = async () => {
        const date = new Date();
        const datetime = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        if (budget.status === "budget") {
            const res = await useServices('budgets', 'PUT', budget.id, {
                client_id: budget.clientId,
                construction_id: budget.constructionId,
                name: budget.name,
                status: "construction",
                construction_start: datetime
            });
        } else {
            const res = await useServices('budgets', 'PUT', budget.id, {
                client_id: budget.clientId,
                construction_id: budget.constructionId,
                name: budget.name,
                status: "finished",
                construction_end: datetime
            });
        }

        executeAction();
    }

    const onSubmit = async () => {
        const res = await useServices('constructions', 'PUT', construction.id, {
            name: construction.name,
            client_id: construction.clientId,
            incoming_margin: values.incoming_margin,
            teams: values.teams,
            address: values.address
        });

        const res2 = await useServices('budgets', 'PUT', budget.id, {
            name: values.name,
            client_id: values.client_id,
            construction_id: budget.constructionId
        });

        if (res.status == 200) {
            toast.success(`Orçamento editado com sucesso`);
            executeAction();
        } else {
            toast.error("Erro na criação");
        }
    };

    return (
        <S.Wrapper>
            <Card title={"Novo orçamento"}>
                <TextField
                    elsize="small"
                    onInputChange={(val) => handleChange("name", val)}
                    label="Nome da Obra"
                    value={values.name}
                    error={errors.address && errors.address}
                />
                <S.Divisor>
                    <div>
                        <TextField
                            elsize="small"
                            type="number"
                            onInputChange={(val) => handleChange("incoming_margin", val)}
                            label="Taxa de Administração (%)"
                            value={values.incoming_margin}
                            error={errors.address && errors.address}
                        />
                    </div>
                    <div>
                        <TextField
                            elsize="small"
                            type="number"
                            onInputChange={(val) => handleChange("teams", val)}
                            label="Equipes"
                            value={values.teams}
                            error={errors.teams && errors.teams}
                        />
                    </div>
                </S.Divisor>
                <br /><br />
                <S.Divisor>
                    <div>
                        <Button onButtonClick={handleStatusChange}>Finalizar Orçamento</Button>
                    </div>
                    <div>
                        <Button floatRight={true} onButtonClick={onSubmit}>Salvar</Button>
                    </div>
                </S.Divisor>
            </Card>
        </S.Wrapper>
    );
};

export default EditBudgetForm;
