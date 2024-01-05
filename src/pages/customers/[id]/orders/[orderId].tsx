import { NextPage } from "next";
import { useRouter } from "next/router";

const Order: NextPage = () => {
  const router = useRouter();
  console.log(router);
  const { orderId, id } = router.query;

  return (
    <h1>
      Order {orderId} from customer {id}
    </h1>
  );
};

export default Order;
