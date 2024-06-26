import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Grid,
} from "@mui/material";
import { FiFilter } from "react-icons/fi";

const TaskFilter = ({ searchStatus, handleSearchChange }) => {
  return (
    <Grid container alignItems="center" spacing={2}>
      <Grid item>
        <FiFilter />
      </Grid>
      <Grid item>
        <FormControl fullWidth>
          <Select
            labelId="searchStatus-label"
            id="searchStatus"
            value={searchStatus}
            onChange={handleSearchChange}
          >
            <MenuItem value="all">عرض الجميع</MenuItem>
            <MenuItem value="completed">عرض المكتمل</MenuItem>
            <MenuItem value="notcompleted"> عرض غير المكتمل</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default TaskFilter;
