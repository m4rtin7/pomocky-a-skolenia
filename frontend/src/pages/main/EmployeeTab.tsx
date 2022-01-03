import { Box, TextField, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { EmployeeData } from "../../types";
import EmployeeModal from "../components/EmployeeModal";
import EmployeeTableWrapper from "../components/EmployeeTableWrapper";
import { getStore, setStore } from "../../store/store";
import { initialEmployee } from "../../constants";
import { fetchEmployees } from "../../helpers/requests";

const EmployeeTab = () => {
  const { zamestnanci } = getStore();
  const [nameInput, setNameInput] = useState<string>("");
  const [surnameInput, setSurnameInput] = useState<string>("");
  const [dataToShow, setDataToShow] = useState(zamestnanci);
  const [skolenieInput, setSkolenieInput] = useState<string>("");
  const [showAddEmployeeModal, setShowAddEmployeeModal] =
    useState<boolean>(false);
  const [showEditEmployeeModal, setShowEditEmployeeModal] =
    useState<boolean>(false);
  const [editEmployeeDate, setEditEmployeeData] =
    useState<EmployeeData>(initialEmployee);

  const columns = Object.keys(zamestnanci.length > 0 ? zamestnanci[0] : []).map(
    (k) => {
      return k === "id"
        ? {
            id: "",
            label: "",
            minWidth: 120,
            format: null,
          }
        : {
            id: k,
            label: k,
            minWidth: 120,
            format: null,
          };
    }
  );

  if (zamestnanci.length === 0) {
    fetchEmployees();
  }

  const [columnsToShow, setColumnsToShow] = useState(columns);

  useEffect(() => {
    setDataToShow(
      zamestnanci.filter((row: any) => {
        return (
          row["meno"].toLowerCase().startsWith(nameInput) &&
          row["priezvisko"].toLowerCase().startsWith(surnameInput)
        );
      })
    );
  }, [nameInput, surnameInput, zamestnanci]);

  useEffect(() => {
    setColumnsToShow(
      columns.filter((col) => {
        return (
          col["id"] === "meno" ||
          col["id"] === "priezvisko" ||
          col["id"] === "" ||
          col["id"].toLowerCase().startsWith(skolenieInput)
        );
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skolenieInput, zamestnanci]);

  console.log(getStore().oblasti);

  const handleAddEmployee = (newEmployee: EmployeeData) => {
    const store = getStore();
    setStore({ ...store, zamestnanci: [...store.zamestnanci, newEmployee] });
  };

  const handleEditEmployee = (data: any) => {
    setEditEmployeeData(data);
    setShowEditEmployeeModal(true);
  };

  return (
    <>
      <Box
        display={"flex"}
        flexDirection={"column"}
        style={{ width: "fit-content" }}
      >
        <Box display={"flex"} flexDirection={"row"}>
          <TextField
            id="Meno"
            label="Meno"
            defaultValue=""
            onChange={(e) => setNameInput(e.target.value.toLowerCase())}
          />
          <TextField
            id="Priezvisko"
            label="Priezvisko"
            defaultValue=""
            onChange={(e) => setSurnameInput(e.target.value.toLowerCase())}
          />
          <TextField
            id="Skolenie"
            label="Skolenie"
            defaultValue=""
            onChange={(e) => setSkolenieInput(e.target.value.toLowerCase())}
          />
          <Button
            onClick={() => setShowAddEmployeeModal(true)}
            variant="contained"
          >
            Pridaj zamestnanca
          </Button>
        </Box>
        <EmployeeTableWrapper
          rows={dataToShow}
          columns={columnsToShow}
          handleEditEmployee={handleEditEmployee}
        />
      </Box>
      <EmployeeModal
        open={showAddEmployeeModal}
        handleClose={() => setShowAddEmployeeModal(false)}
        handleSubmit={handleAddEmployee}
      />
      <EmployeeModal
        open={showEditEmployeeModal}
        handleClose={() => setShowEditEmployeeModal(false)}
        initialData={editEmployeeDate}
        handleSubmit={handleAddEmployee}
      />
    </>
  );
};

export default EmployeeTab;
