import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import Container from "@mui/material/Container";
import { getCustomers } from "../api/customers";
import { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";

const columns: GridColDef[] = [
  { field: "id", headerName: "orderID", width: 90 },
  { field: "customerId", headerName: "Customer ID", width: 90 },

  {
    field: "customer",
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
    field: "cost",
    headerName: "Cost",
    type: "number",
    sortable: true,
    width: 160,
  },
];

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 14 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 31 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 31 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 11 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

export const getStaticProps: GetStaticProps = async () => {
  const data = await getCustomers();

  let orders: any = [];

  data.forEach((customer) => {
    if (customer.orders) {
      customer.orders.forEach((order: any) => {
        console.log(order);
        orders.push({
          ...order,
          customer: customer.name,
          customerId: customer._id,
          id: order._id,
          cost: Number(order.cost.$numberDecimal),
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
    revalidate: 60,
  };
};

const Orders: NextPage = (props: any) => {
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
