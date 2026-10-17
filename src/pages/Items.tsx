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
      <Navbar title="Barang" />

      <SambutanCoomponent
        paragraf1="Master Barang"
        paragraf2="Kelola daftar Barang APD & Tools"
        button={isAdmin ? "+ Tambah barang" : undefined}
        onclick={isAdmin ? () => navigate("/create-items") : undefined}
      />

      {/* <CardComponent /> */}
      <TableItems />
    </div>
  );
};

export default Items;
