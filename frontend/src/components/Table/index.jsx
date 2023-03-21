import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { GridSearchIcon } from "@mui/x-data-grid";
import Card from "../../components/Card";
import React from "react";
import { useState } from "react";
import * as S from "./styles";
import { useEffect } from "react";
import { useId } from "react";
import TextField from "../../components/TextField";

const Table = ({ rows, columns, actions = {}, search, subtotals }) => {

  const [fields, setFields] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [sectorTotal, setSectorTotal] = useState([]);

  const handleChange = (val) => setSearchText(val);

  useEffect(() => {
    const init = () => {
      columns.forEach(column => {
        const fieldNames = fields.map(field => field.name);
        if (fieldNames.indexOf(column.field) === -1) {
          const myFields = fields;
          myFields.push({ name: column.field, width: column.width, render: column.renderCell, complement: column.complementField });
          setFields(myFields);
        }

        const headerNames = headers.map(header => header.name);
        if (headerNames.indexOf(column.headerName) === -1) {
          const myHeaders = headers;
          myHeaders.push({ name: column.headerName, width: column.width });
          setHeaders(myHeaders);
        }
      });
    }

    init();
  }, []);

  const buildHeader = () => {
    const id = useId();
    const padding = rows[0]?.sector ? 24 : 12;
    return (
      <S.Heading style={{
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: padding,
        paddingRight: padding
      }}>
        {headers.map(header => {
          return (
            <div style={{
              width: header.width,
            }} key={`${id}-${header.name}`}>
              {header.name}
            </div>
          );
        })}
        {(!!actions.onEdit || !!actions.onDelete) && (
          <div>
            {!!actions.onAdd &&
              <IconButton
                style={{ visibility: 'hidden' }}
                key={`add`}
                onClick={() => { }}
              >
                <AddIcon></AddIcon>
              </IconButton>
            }
            {!!actions.onEdit &&
              <IconButton
                style={{ visibility: 'hidden' }}
                key={`delete`}
                onClick={() => { }}
              >
                <EditIcon></EditIcon>
              </IconButton>
            }
            {!!actions.onDelete &&
              <IconButton
                style={{ visibility: 'hidden' }}
                key={`edit`}
                onClick={() => { }}
              >
                <DeleteIcon></DeleteIcon>
              </IconButton>
            }
          </div>
        )}
      </S.Heading >
    );
  }

  const isInSearch = (row) => {
    if (!searchText || searchText === '') {
      return true;
    }

    for (const key in row) {
      if (String(row[key]).toLowerCase().indexOf(searchText.toLowerCase()) !== -1) {
        return true;
      }
    }

    return false;
  }

  const buildRows = (allRows) => {
    const filteredRows = allRows.filter(row => {
      if (isInSearch(row)) {
        return row;
      }
    });

    return (
      <>
        {filteredRows.map(row => {
          return (
            <S.Row
              key={row.id}
              rowDisabled={row.rowDisabled}
            >
              {fields.map(field => {
                return (
                  <div style={{ width: field.width }} key={`${row.id}-${row[field.name]}`}>
                    {!!field.render &&
                      field.render(row[field.name])
                    }
                    {field.complement ?
                      !field.render && `${row[field.name]} ${row[field.complement]}`
                      :
                      !field.render && row[field.name]
                    }
                  </div>
                );
              })}
              {(!!actions.onEdit || !!actions.onDelete || !!actions.onAdd) && (
                <div
                  style={row.rowDisabled ? { visibility: 'hidden' } : {}}
                >
                  {!!actions.onAdd &&
                    <IconButton
                      key={`${row.id}-add`}
                      onClick={() => actions.onAdd(row)}
                    >
                      <AddIcon></AddIcon>
                    </IconButton>
                  }
                  {!!actions.onEdit &&
                    <IconButton
                      key={`${row.id}-delete`}
                      onClick={() => actions.onEdit(row)}
                    >
                      <EditIcon></EditIcon>
                    </IconButton>
                  }
                  {!!actions.onDelete &&
                    <IconButton
                      key={`${row.id}-edit`}
                      onClick={() => actions.onDelete(row)}
                    >
                      <DeleteIcon></DeleteIcon>
                    </IconButton>
                  }
                </div>
              )}
            </S.Row>
          );
        })}
      </>
    );
  }

  const buildSectors = () => {
    const sectors = [];
    rows.forEach(row => {
      if (!!row.sector && !sectors.includes(row.sector)) {
        sectors.push(row.sector);
      }
    });

    return (
      <>
        {sectors.sort().map(sector => {
          return (
            <Card title={sector}>
              {buildRows(rows.filter(row => row.sector === sector))}
              {!!subtotals && subtotals[sector] &&
                subtotals[sector].map(total => (
                  <S.Total>
                    <div>{total.name}:</div>
                    <div>{`R$ ${parseFloat(total.value).toFixed(2)}`}</div>
                  </S.Total>
                ))
              }
            </Card>
          );
        })}
      </>
    );
  }

  const buildTable = () => {
    return (
      <S.Wrapper>
        {buildHeader()}
        {!!rows[0]?.sector && buildSectors()}
        {!rows[0]?.sector && buildRows(rows)}
      </S.Wrapper>
    );
  }

  return (
    <>
      {search &&
        <S.Divisor>
          <div>
            <TextField
              elsize="small"
              onInputChange={(val) => handleChange(val)}
              value={searchText}
              placeholder="Buscar"
              style={{ width: `300px` }}
            />
          </div>
          <div>
            <GridSearchIcon />
          </div>
        </S.Divisor>
      }
      {buildTable()}
    </>
  );
};

export default Table;
