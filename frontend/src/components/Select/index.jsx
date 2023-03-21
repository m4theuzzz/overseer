import React, { useEffect, useState } from 'react'
import { useServices } from '../../hooks/useServices';
import * as S from './styles'

const Select = ({
  elsize = 'large',
  label,
  onInputChange,
  value,
  error,
  selected,
  service,
  options,
  ...props
}) => {
  const [data, setData] = useState([]);

  const onChange = (e) => {
    const newValue = e.currentTarget.value
    !!onInputChange && onInputChange(newValue)
  }

  const renderOptions = async () => {
    if (options) {
      setData(options)
      onInputChange(options[0].id);
      return;
    } else {
      await useServices(service, 'GET')
        .then(list => {
          setData(list);
          if (selected) {
            onInputChange(list.find(item => item.id == selected).id)
          }
        })
        .catch(err => console.log(err));
    }
  }

  useEffect(() => {
    renderOptions();
  }, []);

  return (
    <S.Wrapper error={!!error} elsize={elsize}>
      {!!label && <S.Label>{label}</S.Label>}
      <S.InputWrapper>
        <S.Select type='select' {...props} onChange={onChange} value={value}>
          <S.Option key='none' value={null}>Selecione</S.Option>
          {!!data && data.map(option => <S.Option key={option.id} value={option.id}>{option.name || option.id}</S.Option>)}
        </S.Select>
      </S.InputWrapper>
      {error !== 'onlyborder' && !!error && <S.Error>{error}</S.Error>}
    </S.Wrapper>
  )
}

export default Select