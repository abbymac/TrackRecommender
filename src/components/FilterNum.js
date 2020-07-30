import React from "react";
import styled from "styled-components";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import Grid from "@material-ui/core/Grid";
import ReactTooltip from "react-tooltip";

const FilterNum = ({ filter, name, dispatch, i }) => {
  return (
    <Container key={i} item xs={12} sm={6}>
      <ToolTip id={i} multiline="true" type="error" />
      <MainNumContain id="filter">
        <a data-tip={filter.description} data-for={i} multiline="true">
          <Text>{name}</Text>
        </a>

        <RemoveIcon
          onClick={() => dispatch({ type: "reduceValue", payload: name })}
        />

        <Text>{filter.value}</Text>
        <AddIcon
          onClick={() => dispatch({ type: "addValue", payload: name })}
          value={filter.value}
        />
      </MainNumContain>
    </Container>
  );
};

export default FilterNum;

const Text = styled.div`
  font-size: 15px;
`;

const ToolTip = styled(ReactTooltip)`
  width: 300px;
`;
const Container = styled(Grid)`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background-color: #414f5f;
  color: #c8e1e3;
  border: #f5f5f5 solid 1px;
`;

const MainNumContain = styled.div`
  display: inline-flex;
  align-items: center;
  margin: auto;
`;
