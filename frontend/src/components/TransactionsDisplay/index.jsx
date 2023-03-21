import React from "react";
import Card from "../Card";

const TransactionsDisplay = ({ transactionsReport }) => {

  return (
    <>
      <Card title='Receita'>
        {`R$ ${transactionsReport.incoming}`}
      </Card>

      <Card
        title={transactionsReport.liquid > 0 ? 'Lucro' : 'Prejuízo'}
      >
        {`R$ ${transactionsReport.liquid}`}
      </Card>

      <Card title='Despesas'>
        {`R$ ${transactionsReport.outcoming}`}
      </Card>
    </>
  );
};

export default TransactionsDisplay;
