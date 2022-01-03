import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { useEffect, useState } from "react";

type DropdownWithAddProps = {
  options: Option[];
  initialValue: Option | null;
  setData: (s: string) => void;
};

type Option = {
  inputValue?: string;
  name: string;
};

const filter = createFilterOptions<Option>();

const DropdownWithAdd = ({
  options,
  setData,
  initialValue,
}: DropdownWithAddProps) => {
  const [value, setValue] = useState<Option | null>(initialValue);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (value === null || value.inputValue === "")
      setError("Oblasť is a required field!");
    else setError("");
  }, [value]);

  return (
    <Autocomplete
      sx={{ flexGrow: 1 }}
      value={value}
      onChange={(event, newValue) => {
        if (typeof newValue === "string") {
          setValue({
            name: newValue,
          });
          setData(newValue);
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          setValue({
            name: newValue.inputValue,
          });
          setData(newValue.inputValue);
        } else {
          setValue(newValue);
          setData(newValue?.name || "");
        }
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option.name);
        if (inputValue !== "" && !isExisting) {
          filtered.push({
            inputValue,
            name: `Pridaj "${inputValue}"`,
          });
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      fullWidth={true}
      id="free-solo-with-text-demo"
      options={options}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === "string") {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.name;
      }}
      renderOption={(props, option) => <li {...props}>{option.name}</li>}
      freeSolo
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={"Oblasť"}
          helperText={error}
          error={!!error}
        />
      )}
    />
  );
};

export default DropdownWithAdd;
