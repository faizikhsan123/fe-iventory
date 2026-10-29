import TableItems from "@/components/items/TableItems";
import Navbar from "@/components/Navbar";
import SambutanCoomponent from "@/components/SambutanCoomponent";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/auth/useAuth";

const Items = () => {
  const navigate = useNavigate()
  const { isAdmin } = useAuth();
  return (
    <div>
      <Navbar title="Items" />

      <SambutanCoomponent
        paragraf1="Item Master"
        paragraf2="Manage the list of PPE & Tools items"
        button={isAdmin ? "+ Add item" : undefined}
        onclick={isAdmin ? () => navigate("/create-items") : undefined}
      />

      {/* <CardComponent /> */}
      <TableItems />
    </div>
  );
};

export default Items;
