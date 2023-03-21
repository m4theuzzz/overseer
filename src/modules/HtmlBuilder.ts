import { ClientsController } from "../controllers/ClientsController";

const clientsController = new ClientsController();

export const buildHeading = () => {
    return `
        <div id="header">
            <img src="logo.png" alt="logo">

            <p>Data: ${new Date().toLocaleDateString('pt-BR')}</p>
        </div>
        <br/>
    `;
}

export const buildClientSection = async (clientId: number, companyId: number, id: string = null) => {
    const client = await clientsController.getClientById(clientId, companyId);

    return `
        <div ${id ? `id="${id}"` : ''}>
            <h2>Informações do cliente</h2>
            <hr>
            <div style="display: flex; justify-content: space-around;"><span style="width: 50%;">${client.name}</span> <span style="width: 50%;">${client.cpfCnpj}</span></div>
            <br/>
            <div style="display: flex; justify-content: space-around;"><span style="width: 50%;">${client.phone}</span> <span style="width: 50%;">${client.email}</span></div>
        </div>
        <br/>
    `;
}

export interface TableColumn {
    fieldName: string;
    label: string;
}

export const buildTable = (columns: TableColumn[], rows: any[], title: string = null, className: string = null, total: string = null) => {
    let table = ``;

    if (title) {
        table = `<h3 id="sector-name">Setor: ${title}</h3>`;
    }

    table += `<table ${className ? `className="${className}"` : ''} ><tr>`;

    columns.forEach(column => {
        table += `<th>${column.label}</th>`;
    });

    table += `</tr>`;

    rows.forEach(row => {
        table += `<tr>`;
        columns.forEach(column => {
            table += `<td>${row[column.fieldName]}</td>`;
        });
        table += `</tr>`;
    });

    table += `</table>`;

    if (!!total) {
        table += `<p id="budget-price">Valor total: R$ ${parseFloat(total).toFixed(2)}</p><br/>`;
    }

    return table;
}

export interface HtmlStyles {
    [key: string]: { [key: string]: string };
}

export const buildStyle = (styles: HtmlStyles) => {
    let style = `<style>`;
    for (const key in styles) {
        style += `${key} {`;
        for (const prop in styles[key]) {
            style += `${prop}: ${styles[key][prop]};`
        }
        style += `}\n`;
    }
    style += `</style>`;
    return style;
}

export const buildScript = (scripts: string[]) => {
    let script = `<script>`;
    for (const line of scripts) {
        script += `${line}\n`;
    }
    script += `</script>`;
    return script;
}

export const buildHead = (title: string) => {
    return `
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
        </head>
    `;
}

export const buildNoteBlock = (title: string, notes: string[]) => {
    let noteBlock = `
        <h2>${title}:</h2>
        <div id="box">
    `;

    for (const note of notes) {
        noteBlock += `<p>${note}</p>`;
    }

    noteBlock += `</div>`;
    return noteBlock;
}
