import {
    buildClientSection,
    buildHead,
    buildHeading,
    buildNoteBlock,
    buildStyle,
    buildTable,
    TableColumn
} from "../modules/HtmlBuilder";
import { BudgetsController } from "./BudgetsController";
import { ConstructionsController } from "./ConstructionsController";
import { ServicesController } from "./ServicesController";

const budgets = new BudgetsController();
const services = new ServicesController();
const constructions = new ConstructionsController();

export class ExportsController {
    private translateMesureUnit = (rawUnit: string): string => {
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
    exportClientBudget = async (budgetId: number, companyId: number, notes: string = '') => {
        const budget = await budgets.getBudgetById(budgetId, companyId);
        const construction = await constructions.getConstructionById(budget.constructionId, companyId);
        const budgetServices = (await budgets.getBudgetServices(budgetId, companyId)).filter(serv => serv.status === "ok");
        const servicesList = await services.getServices(companyId);
        const sectors = budgetServices.reduce((acc: string[], cur) => {
            if (!acc.includes(cur.sector)) {
                acc.push(cur.sector);
            }
            return acc;
        }, []);

        const styles = {
            "body": {
                "margin-left": "3rem",
                "font-family": "Roboto, sans-serif",
                "background-color": "white",
            },
            "h1": {
                "font-size": "24px",
            },
            "h2": {
                "font-size": "21px",
            },
            "h3": {
                "font-size": "18px",
            },
            "hr": {
                "border": "1px solid #A9ABAC",
                "width": "95%",
                "margin-right": "5%",
            },
            "p, span": {
                "font-weight": "bold",
                "font-size": "13px"
            },
            "table": {
                "font-family": "arial, sans-serif",
                "border-collapse": "collapse",
                "width": "95%",
            },
            "td, th": {
                "border": "1px solid #eeeeee",
                "text-align": "center",
                "padding": "8px",
            },
            "th": {
                "font-size": "14px"
            },
            "td": {
                "font-size": "13px"
            },
            "tr:nth-child(even)": {
                "background-color": "#eeeeee",
            },
            "#header": {
                "display": "flex",
                "align-items": "center",
                "justify-content": "space-between",
                "margin-bottom": "2rem",
            },
            "#header img": {
                "width": "auto",
                "height": "100px",
            },
            "#header p": {
                "margin-right": "5%",
            },
            "#header h1": {
                "margin-right": "3rem",
            },
            "#box": {
                "width": "95%",
                "min-height": "100px",
                "border": "1px solid black",
            },
            "#client-info": {},
            ".sector-table": {},
            ".divisor": {
                "width": "100%",
                "display": "flex",
            }
        }

        let html = `
            <!DOCTYPE html>
            <html lang="pt-BR">
                ${buildHead('Orçamento')}
                ${buildStyle(styles)}
                <body>
                    ${buildHeading()}
                    ${await buildClientSection(budget.clientId, companyId, "client-info")}
                    <div id="budget">
                        <h2>Orçamento:</h2>
                        <hr/>
        `;

        const columns = [
            {
                fieldName: "service",
                label: "Serviço"
            },
            {
                fieldName: "quantity",
                label: "Quantidade"
            },
            {
                fieldName: "unit",
                label: "Unidade"
            },
            {
                fieldName: "unitaryPrice",
                label: "Preço Unitário"
            },
            {
                fieldName: "budgetedPrice",
                label: "Preço Orçado"
            }
        ] as TableColumn[];

        const sectorsTotals: number[] = [];

        sectors.forEach(sector => {
            const budServices = budgetServices.filter(serv => serv.sector === sector);

            if (budServices.length !== 0) {
                const rows: any = budServices.map(budServ => {
                    const service = servicesList.find(serv => serv.id === budServ.serviceId);
                    const budgetedCost = (Number(budServ.quantity) * service.unityCost);
                    return {
                        service: service.name,
                        quantity: budServ.quantity,
                        unit: this.translateMesureUnit(String(service.mesureUnit)),
                        unitaryPrice: `R$ ${service.unityCost}`,
                        budgetedPrice: `R$ ${(budgetedCost + (budgetedCost * service.errorMargin)).toFixed(2)}`
                    }
                });

                const sectorSubtotal = rows.reduce((acc: number, cur: any) => {
                    acc += parseFloat(cur.budgetedPrice.replace('R$', ''))
                    return acc;
                }, 0);

                sectorsTotals.push(sectorSubtotal);

                html += buildTable(columns, rows, sector, `sector-table`, sectorSubtotal);
            }
        });

        const budgetedTotal = sectorsTotals.reduce((acc, cur) => acc += cur, 0);

        html += `
                    </div>
                    <div>
                        <h3>Valor Total Orçado: R$ ${(budgetedTotal + (budgetedTotal * construction.incomingMargin)).toFixed(2)}</h3>
                    </div>
                    <br/>
                    <div>
                        ${buildNoteBlock('Observações', notes.split('\n'))}
                    </div>
                </body>
            </html>
        `;

        return html;
    }
}
