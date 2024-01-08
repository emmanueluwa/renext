import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";

import Info from "@mui/icons-material/Info";
import PersonIcon from "@mui/icons-material/Person";
import Grid from "@mui/material/Grid";
import { Customer } from "@/utils/types";

// an object customer of type Customer
type props = {
  customer: Customer;
};

const CustomerComponent = ({ customer }: props) => {
  return (
    <Grid>
      <span
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Tooltip title={customer._id?.toString()}>
          <PersonIcon fontSize="small" style={{ marginRight: 5 }} />
        </Tooltip>
        {customer.name}
      </span>

      <p>{customer.industry}</p>
      <Button variant="outlined">View Orders</Button>
    </Grid>
  );
};

export default CustomerComponent;
