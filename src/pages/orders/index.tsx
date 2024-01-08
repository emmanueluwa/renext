import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import Container from "@mui/material/Container";
import { getCustomers } from "../api/customers";
import { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { Customer, Order } from "@/utils/types";
import { ObjectId } from "mongodb";

const columns: GridColDef[] = [
  { field: "id", headerName: "orderID", width: 90 },
  { field: "customerId", headerName: "Customer ID", width: 90 },

  {
    field: "customerName",
    headerName: "Customer",
    width: 150,
    editable: true,
  },

  {
    field: "description",
    headerName: "Description",
    type: "string",
    width: 400,
    editable: true,
  },
  {
    field: "orderCost",
    headerName: "Cost",
    type: "number",
    sortable: true,
    width: 160,
  },
];

//extending the Order Type
interface OrderRow extends Order {
  orderCost: Number;
  customerName: string;
  customerId?: ObjectId;
  id: ObjectId;
}

type Props = {
  orders: Order[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const data = await getCustomers();

  let orders: OrderRow[] = [];

  data.forEach((customer: Customer) => {
    if (customer.orders) {
      customer.orders.forEach((order: Order) => {
        orders.push({
          ...order,
          customerName: customer.name,
          customerId: customer._id,
          id: order._id,
          orderCost: Number(order.cost.$numberDecimal),
        });
      });
    }
  });

  return {
    props: {
      orders: orders,
      // AN ALTERNATIVE SOLUTION
      // orders: data
      //   .map((customer) => {
      //     return customer.orders || null;
      //   })
      //   //working with array of arrays, only get customers with orders
      //   .flat(1)
      //   .filter((order) => {
      //     return order !== null;
      //   }),
    },
  };
};

const Orders: NextPage<Props> = (props) => {
  // router.query.customerId
  const { customerID } = useRouter().query;
  console.log(customerID);
  return (
    <Container>
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          //when sure customerid is available apply filter
          filterModel={{
            items: [
              {
                field: "customerId",
                operator: "equals",
                value: customerID,
              },
            ],
          }}
          rows={props.orders}
          columns={columns}
          // initialState={{
          //   pagination: {
          //     paginationModel: {
          //       pageSize: 5,
          //     },
          //   },
          // }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
          /*
          automatically filter to all orders of customer when customer orders button clicked
          use a hook to get the value of the id from the url
          */
          initialState={{
            filter: {
              filterModel: {
                items: [
                  {
                    field: "customerId",
                    operator: "equals",
                    value: customerID,
                  },
                ],
              },
            },
          }}
        />
      </Box>
    </Container>
  );
};

export default Orders;
