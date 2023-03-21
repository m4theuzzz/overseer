import * as S from "./styles";

const Radio = ({
  label,
  onCheck,
  labelColor = "white",
  labelFor = "",
  value,
  ...props
}) => {
  const onChange = () => {
    !!onCheck && onCheck(value);
  };

  return (
    <S.Wrapper>
      <S.Input
        name={labelFor}
        type="radio"
        value={value}
        onChange={onChange}
        {...props}
      />
      {!!label && (
        <S.Label labelColor={labelColor} htmlFor={labelFor}>
          {label}
        </S.Label>
      )}
    </S.Wrapper>
  );
};

export default Radio;
