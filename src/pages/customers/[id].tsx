import { NextPage } from "next";
import { useRouter } from "next/router";

const Customer: NextPage = () => {
  const router = useRouter();
  console.log(router);
  const { id } = router.query;

  return <h1>Customer</h1>;
};

export default Customer;
