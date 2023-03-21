import React, { useEffect, useState } from "react";
import Button from "../../components/Button";
import FormModal from "../../components/FormModal";
import { useServices } from "../../hooks/useServices";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";
import AddServiceForm from "./forms/addserviceform";
import EditBudgetForm from "./forms/editBudgetForm";
import * as S from "./styles";
import Table from "../../components/Table";
import PageHeader from "../../components/PageHeader";
import toast from "react-hot-toast";
import AddAdendoForm from "./forms/addadendoform";
import TransactionsForm from "../Transactions/form";
import Card from "../../components/Card";
import { IconButton } from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import SettingsIcon from "@mui/icons-material/Settings";
import PreviewPDF from "./forms/previewPdfFrom";


const BudgetsView = () => {
  const { paramId } = useParams();
  const navigate = useNavigate()

  const columnsPattern = {
    budget: [
      {
        field: "serviceName",
        headerName: "Serviço",
        width: `400px`,
      },
      {
        field: "quantity",
        headerName: "Quantidade",
        width: `100px`,
        complementField: "unity"
      },
      {
        field: "cost",
        headerName: "Preço unitario",
        width: `200px`,
      },
      {
        field: "budgetedCost",
        headerName: "Preço orçado",
        width: `200px`,
      },
    ],
    construction: [
      {
        field: "serviceName",
        headerName: "Serviço",
        width: `300px`,
      },
      {
        field: "quantity",
        headerName: "Quantidade",
        width: `100px`,
        complementField: "unity"
      },
      {
        field: "endDate",
        headerName: "Previsão",
        width: `100px`,
      },
      {
        field: "budgetedCost",
        headerName: "Preço orçado",
        width: `100px`,
      },
      {
        field: "realCost",
        headerName: "Preço real",
        width: `100px`,
      },
    ],
    finished: []
  };

  const [modal, setModal] = useState({
    open: false,
    info: "",
    title: "",
    action: () => { },
  });

  const [formModal, setFormModal] = useState({
    open: false,
    info: "",
    title: "",
    action: () => { },
  });

  const [editFormModal, setEditFormModal] = useState({
    open: false,
    info: "",
    title: "",
    action: () => { },
  });

  const [previewPdfModal, setPreviewPdfModal] = useState({
    open: false,
    info: "",
    title: "",
    action: () => { },
  });

  const [adendoModal, setAdendoModal] = useState({
    open: false,
    info: "",
    title: "",
    action: () => { },
  });

  const [transactionModal, setTransactionModal] = useState({
    open: false,
    info: "",
    title: "",
    action: () => { },
  });

  const [budgetedTotal, setBudgetedTotal] = useState(0);
  const [realTotal, setRealTotal] = useState(0);
  const [outcomings, setOutcomings] = useState(0);
  const [incomings, setIncomings] = useState(0);

  const [budgetServices, setBudgetServices] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [totalsBySector, setTotalsBySector] = useState({});

  const [construction, setConstruction] = useState();
  const [budget, setBudget] = useState();
  const [selectedService, setSelectedService] = useState();

  const listSectors = (services) => {
    let sectors = []

    services.forEach(service => {
      if (!!service && !sectors.includes(service.sector)) {
        sectors.push(service.sector)
      }
    })

    setSectors(sectors);
    return sectors;
  }

  const translateMesureUnit = (rawUnit) => {
    switch (rawUnit) {
      case "m2":
        return "m²";

      case "m3":
        return "m³";

      case "day":
        return "dia(s)";

      case "unit":
        return "unidade(s)";

      default:
        return rawUnit;
    }
  }

  const calculateTotal = (listedServices, margin, isSectorized = false, transactions = null) => {
    const total = listedServices.reduce((acc, cur) => {
      if (cur.status == "ok") {
        const budgetedCost = parseFloat(cur.budgetedCost.replace('R$', ''));
        return acc + budgetedCost;
      }

      return acc;
    }, 0);

    if (budget?.status !== "budget") {
      const totalReal = (transactions ?? []).reduce((acc, cur) => {
        if (cur.type === "incoming") {
          acc += cur.value;
        } else {
          acc -= cur.value;
        }

        return acc;
      }, 0)

      if (isSectorized) {
        return { budgetedTotal: total * (1 + margin), realTotal: totalReal };
      } else {
        setRealTotal(totalReal);

        if (!!transactions) {
          const { outcoming, incoming } = transactions.reduce((acc, cur) => {
            if (cur.type === "outcoming") {
              acc.outcoming += cur.value;
            } else {
              acc.incoming += cur.value;
            }
            return acc;
          }, { outcoming: 0, incoming: 0 });

          setIncomings(incoming);
          setOutcomings(outcoming);
        }
      }
    }

    if (isSectorized) {
      return { budgetedTotal: total * (1 + margin) };
    } else {
      setBudgetedTotal(total * (1 + margin));
    }
  }

  const handleDelete = async (id) => {
    const res = await useServices("budgetServices", "DELETE", id, null, paramId);

    if (res.status == 200) {
      getConstruction();
      toast.success("Serviço excluído com sucesso");
      setModal({
        open: false,
        info: "",
        title: "",
        action: () => { },
      });
    } else {
      toast.error("Erro ao excluir serviço");
    }
  }

  const handleRemove = async (row) => {
    const res = await useServices("budgetServices", "PUT", row.id, {
      service_id: row.serviceId,
      quantity: row.quantity,
      sector: row.sector,
      status: "removed"
    }, paramId);

    if (res.status == 200) {
      getConstruction();
      toast.success("Serviço removido com sucesso");
      setModal({
        open: false,
        info: "",
        title: "",
        action: () => { },
      });
    } else {
      toast.error("Erro ao remover serviço");
    }
  }

  const translateStatus = (stat) => {
    if (stat == "budget") {
      const startDate = budget ? new Date(budget?.createdAt).toLocaleDateString('pt-BR') : null;
      return `Orçando (desde ${startDate})`;
    }
    if (stat == "construction") {
      const startDate = budget ? new Date(budget?.constructionStart).toLocaleDateString('pt-BR') : null;
      return `Em andamento (desde ${startDate})`;
    }
    if (stat == "finished") {
      const endDate = budget ? new Date(budget?.constructionEnd).toLocaleDateString('pt-BR') : null;
      return `Concluída em ${endDate}`;
    }

    return stat;
  }

  const getBudgetServices = async (margin, bud) => {
    const budgetServices = await useServices('budgetServices', 'GET', null, null, paramId);
    const budgetServicesCosts = await useServices('budgetServices', 'GET', 'costs', null, paramId);
    const services = await useServices('services', 'GET');

    let servicesDuration = 0;

    const res = budgetServices.map(budServ => {
      const service = services.find(service => service.id === budServ.serviceId);
      const budgetedCost = (budServ.quantity * service.unityCost);
      if (service) {
        if (bud.status !== "budget") {
          let constructionStart = null;
          if (budServ.status === "ok") {
            constructionStart = new Date(bud.updatedAt);
            servicesDuration += Math.ceil(service.coefficient * budServ.quantity);
            constructionStart.setDate(constructionStart.getDate() + servicesDuration);
          }

          return {
            ...budServ,
            quantity: budServ.quantity,
            unity: translateMesureUnit(service.mesureUnit),
            serviceName: service?.name || null,
            endDate: constructionStart ? constructionStart.toLocaleDateString() : null,
            cost: `R$ ${parseFloat(service.unityCost).toFixed(2)}`,
            budgetedCost: `R$ ${parseFloat(budgetedCost * (1 + service.errorMargin)).toFixed(2)}`,
            realCost: budServ.status !== "ok" ? null : `R$ ${parseFloat(budgetServicesCosts.find(serv => serv.serviceId === service.id)?.totalServico ?? 0).toFixed(2)}`,
            rowDisabled: budServ.status !== "ok"
          }
        } else {
          return {
            ...budServ,
            quantity: budServ.quantity,
            unity: translateMesureUnit(service.mesureUnit),
            serviceName: service?.name || null,
            cost: `R$ ${parseFloat(service.unityCost).toFixed(2)}`,
            budgetedCost: `R$ ${parseFloat(budgetedCost * (1 + service.errorMargin)).toFixed(2)}`,
            rowDisabled: budServ.status !== "ok"
          }
        }
      }

      return null;
    });

    const transactions = await useServices('budgetsTransactions', 'GET', null, null, bud.id);

    if (res) {
      setBudgetServices(res);
      const sects = listSectors(res);
      calculateTotal(res, margin, false, transactions);
      buildSubtotals(res, margin, sects, transactions);
    }
  }

  const buildSubtotals = (budServs, margin, sects, transactions) => {
    if (!!sects && !!budServs) {
      const sectorTotals = sects.reduce((acc, sector) => {
        if (!acc[sector]) {
          acc[sector] = [];
        }
        const servicesBySector = budServs.filter(service => service.sector === sector);
        const servicesIds = servicesBySector.map(serv => serv.serviceId);
        const subtotals = calculateTotal(
          servicesBySector,
          margin,
          true,
          transactions.filter(transaction => servicesIds.includes(transaction.serviceId)));
        for (const total in subtotals) {
          if (total == "budgetedTotal") {
            acc[sector].push({ name: "Subtotal Orçado", value: subtotals[total] });
          } else {
            if (subtotals[total]) {
              acc[sector].push({ name: "Subtotal Real", value: subtotals[total] });
            }
          }
        }
        return acc;
      }, {});

      setTotalsBySector(sectorTotals);
    } else {
      return null;
    }
  }

  const getConstruction = async () => {
    const bud = await useServices('budgets', 'GET', paramId);
    const construct = await useServices('constructions', 'GET', bud.constructionId);

    setBudget(bud);
    setConstruction(construct);

    await getBudgetServices(construct.incomingMargin, bud);
  }

  useEffect(() => {
    getConstruction();
  }, [])

  const handleAddModal = () => {
    getConstruction();
  }

  const actions = {
    onAdd: budget?.status == "construction" ?
      (row) => {
        setSelectedService(row);
        setTransactionModal({
          open: true,
          info: row.constructionId,
          title: "Adicionar Transação ao Serviço",
          action: () => handleAddModal()
        });
      } : null,
    onDelete: (row) => {
      if (budget?.status == "budget") {
        setModal({
          open: true,
          info: row.name,
          title: "Excluir Serviço",
          action: () => handleDelete(row.id),
        })
      } else {
        setModal({
          open: true,
          info: row.name,
          title: "Remover Serviço",
          action: () => handleRemove(row),
        })
      }
    }
  }

  return (
    <S.Wrapper>
      <PageHeader onBack={() => navigate(`/budgets`)} title='Orçamentos' subtitle={`${budget?.name} - ${translateStatus(budget?.status)}`} />
      {budget?.status !== "finished" &&
        <div>
          <IconButton
            style={{ float: 'right' }}
            onClick={() => {
              setEditFormModal({
                open: true,
                info: null,
                title: "Adicionar serviços",
                action: () => getConstruction(),
              });
            }}
          >
            <SettingsIcon />
          </IconButton>

          {budget?.status === "budget" &&
            <IconButton
              style={{ float: 'right', marginRight: '24px' }}
              onClick={() => {
                setPreviewPdfModal({
                  open: true,
                  info: budget.id,
                  title: "Pré visualização do pdf",
                  action: (message) => {
                    if (message) {
                      toast.success(message);
                    } else {
                      toast.error('Falha ao exportar orçamento.');
                    }
                  }
                });
              }}
            >
              <MailIcon />
            </IconButton>
          }
        </div>
      }

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <FormModal
          modal={formModal}
          setModal={setFormModal}
          Form={AddServiceForm}
        />
        <FormModal
          modal={editFormModal}
          setModal={setEditFormModal}
          Form={EditBudgetForm}
        />
        <FormModal
          modal={previewPdfModal}
          setModal={setPreviewPdfModal}
          Form={PreviewPDF}
        />
        <Modal
          modal={modal}
          setModal={setModal}
        />
        <FormModal
          modal={adendoModal}
          setModal={setAdendoModal}
          Form={AddAdendoForm}
        />
        <FormModal
          modal={transactionModal}
          setModal={setTransactionModal}
          Form={TransactionsForm}
          partialData={selectedService}
        />
        <div style={{ width: '100%', marginTop: '36px', marginBottom: '36px' }}>
          <S.Divisor
            float='left'
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <S.Total>
                <div>Total Orçado:</div>
                <div>{`R$ ${parseFloat(budgetedTotal).toFixed(2)}`}</div>
              </S.Total>
              {budget?.status !== "budget" &&
                <S.Total>
                  <div>Total de Gastos:</div>
                  <div>{`R$ ${parseFloat(outcomings).toFixed(2)}`}</div>
                </S.Total>
              }
            </div>

            {budget?.status !== "budget" &&
              <S.CardWrapper>
                <Card title={'Recebido'} centeredValue={true}>
                  <S.CardText color={'green'}>
                    {`R$ ${parseFloat(incomings).toFixed(2)}`}
                  </S.CardText>
                </Card>
                <Card title={realTotal < 0 ? 'Prejuízo' : 'Lucro'} centeredValue={true}>
                  <S.CardText color={realTotal < 0 ? 'red' : 'green'}>
                    {`R$ ${parseFloat(realTotal).toFixed(2)}`}
                  </S.CardText>
                </Card>
                <Card title={"Margem de Lucro"} centeredValue={true}>
                  <S.CardText color={realTotal < 0 ? 'red' : 'green'}>
                    {realTotal && outcomings ?
                      `${parseFloat(realTotal * 100 / Math.abs(outcomings)).toFixed(1)}%`
                      :
                      `0%`
                    }
                  </S.CardText>
                </Card>
              </S.CardWrapper>
            }
          </S.Divisor>
        </div>
        <div style={
          budget?.status == 'construction' ?
            { marginTop: '15px', width: '100%', display: 'flex', justifyContent: 'space-between' }
            :
            {}
        }>
          {budget?.status === "construction" &&
            <Button
              onButtonClick={() => {
                setSelectedService({
                  budgetId: budget.id
                });
                setTransactionModal({
                  open: true,
                  info: construction.id,
                  title: "Adicionar Transação ao Serviço",
                  action: () => handleAddModal()
                });
              }}
            >
              + Transação
            </Button>
          }

          {budget?.status != 'finished' && <Button
            floatRight={true}
            onButtonClick={() => {
              if (budget?.status == 'budget') {
                setFormModal({
                  open: true,
                  info: sectors,
                  title: "Adicionar serviços",
                  action: () => getConstruction(),
                });
              } else {
                setAdendoModal({
                  open: true,
                  info: { services: budgetServices, sectors: sectors },
                  title: "Adicionar adendo",
                  action: () => getConstruction(),
                });
              }
            }}
          >
            {budget?.status == 'budget' ? "+ Serviços" : "+ Adendo"}
          </Button>}
        </div>
        <div>
          {budget?.status === "budget" &&
            <Table rows={budgetServices} columns={columnsPattern.budget} actions={actions} subtotals={totalsBySector}></Table>
          }
          {budget?.status === "construction" &&
            <Table rows={budgetServices} columns={columnsPattern.construction} actions={actions} subtotals={totalsBySector}></Table>
          }
          {budget?.status === "finished" &&
            <Table rows={budgetServices} columns={columnsPattern.construction} subtotals={totalsBySector}></Table>
          }
        </div>
      </div>
    </S.Wrapper >
  );
};

export default BudgetsView;
