/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import * as S from "./styles";

import Input from "../TextField";
import Loader from "../Loader";

import { Search } from "styled-icons/bootstrap";
import { UpArrow } from "styled-icons/boxicons-solid";
import { DownArrow } from "@styled-icons/boxicons-solid/DownArrow";
import { HandleClickOutside } from "../../utils/handlers";
import { useServices } from "../../hooks/useServices";

const AsyncDropdownSingle = ({
  label,
  placeholder = "...",
  onDropdownChange,
  initialValue,
  service,
  options,
}) => {
  const sentinelRef = useRef(null);

  const [isActive, setIsActive] = useState(false);
  const [selected, setSelected] = useState(initialValue);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChangeSearch = async (a) => {
    setLoading(true);
    setSearchTerm(a);
    setError("");

    if (a == "") {
      setSearchResults([]);
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      if (options) {
        setData(options);
        setLoading(false);
        return;
      }

      setLoading(true);
      const list = await useServices(service, "GET");

      setData(list);
      setLoading(false);
    } catch (error) {
      setData([]);
    }
  };

  useEffect(() => {
    if (isActive) {
      fetchData();
    }
  }, [data, isActive]);

  useEffect(() => {
    const { current } = sentinelRef;

    const intersectionObserver = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setCurrentPage((currentValue) => currentValue + 1);
      }
    });

    current && intersectionObserver.observe(current);
    return () => intersectionObserver.disconnect();
  }, [isActive]);

  useEffect(() => {
    if (selected) {
      !!onDropdownChange && onDropdownChange(selected);
    }

  }, [selected]);

  const handleOptionChange = (element) => {
    setSelected(element);
    handleClose();
  };

  const handleClose = () => {
    setIsActive(false);
    setError("");
    setLoading(false);
  };

  const handleToggle = () => {
    if (isActive) {
      handleClose();
    } else {
      setIsActive(true);
    }
  };

  const renderResults = (arr) => {
    return arr.map((el) => (
      <S.DropdownItem
        key={el.id}
        onClick={() => {
          handleOptionChange(el);
        }}
      >
        <div>{el.name}</div>
      </S.DropdownItem>
    ));
  };

  return (
    <S.AllWrapper>
      {!!label && <S.Label>{label}</S.Label>}
      <S.Wrapper isActive={isActive}>
        <HandleClickOutside callback={handleClose}>
          <S.DropdownButton onClick={handleToggle}>
            {selected ? selected.name : placeholder}
            {isActive ? <UpArrow /> : <DownArrow />}
          </S.DropdownButton>
          {isActive && (
            <>
              <S.InputWrap>
                <Input
                  elsize="small"
                  // onInputChange={handleChangeSearch}
                  icon={loading ? <Loader small color="cian" /> : <Search />}
                />
              </S.InputWrap>
              <S.DropdownContent>
                {!error ? (
                  <>{renderResults(data)}</>
                ) : (
                  <S.ErrorBox>{error}</S.ErrorBox>
                )}
              </S.DropdownContent>
            </>
          )}
        </HandleClickOutside>
      </S.Wrapper>
    </S.AllWrapper>
  );
};

export default AsyncDropdownSingle;
