import Button from "../../../components/Button";
import { useEffect, useState } from "react";
import Card from "../../../components/Card";
import { useServices } from "../../../hooks/useServices";
import * as S from '../styles';

const PreviewPDF = ({ id, executeAction }) => {
    const [html, setHtml] = useState('<html><body></body></html>');
    const [budget, setBudget] = useState();
    const [client, setClient] = useState();

    const init = async () => {
        const bud = await useServices('budgets', 'GET', id);
        const clientOwner = await useServices('clients', 'GET', bud.clientId);

        const res = await useServices('exportBudget', 'POST', id);
        const htmlText = await res.text();

        setHtml(htmlText);
        setBudget(bud);
        setClient(clientOwner);
    }

    useEffect(() => {
        init()
    }, []);

    const handleExportPDF = () => {
        const wnd = window.open("about:blank", "", "_blank");
        wnd.document.write(html);
        wnd.print();
        executeAction('Orçamento exportado com sucesso.');
    };

    const handleSendEmail = async () => {
        const mailOptions = {
            from: `Pioventi Engenharia <contato@pioventi.com.br>`,
            to: `${client.name} <${client.email}>`,
            subject: `Seu novo orçamento chegou (versão: ${new Date().toLocaleDateString('pt-BR')})`,
            html: html
        }
        useServices('mailer', 'POST', null, mailOptions).then(res => {
            if (res.status === 200) {
                executeAction('Orçamento enviado com sucesso.');
            }
        }).catch(err => {
            executeAction('Ouve um problema ao enviar o email.');
        });
    }

    return (
        <>
            <Card title={"Pré visualização de Exportação"}>
                <S.Divisor>
                    <S.PdfPreview>
                        <div dangerouslySetInnerHTML={{ __html: html }}></div>
                    </S.PdfPreview>
                    <S.PdfOptions>
                        <Button
                            onButtonClick={handleSendEmail}
                        >
                            Enviar por Email
                        </Button>
                        <Button
                            onButtonClick={handleExportPDF}
                        >
                            Exportar PDF
                        </Button>
                    </S.PdfOptions>
                </S.Divisor>
            </Card>
        </>
    );
}

export default PreviewPDF;