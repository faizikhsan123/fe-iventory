import TableItems from "@/components/items/TableItems";
import Navbar from "@/components/Navbar";
import SambutanCoomponent from "@/components/SambutanCoomponent";
import { useNavigate } from "react-router";

const Items = () => {
  const navigate = useNavigate()
  return (
    <div>
      <Navbar title="Barang" />

      <SambutanCoomponent
        paragraf1="Master Barang"
        paragraf2="Kelola daftar Barang APD & Tools"
        button="+ Tambah barang"
        onclick={() => navigate("/create-items")}
      />

      {/* <CardComponent /> */}
      <TableItems />
    </div>
  );
};

export default Items;
