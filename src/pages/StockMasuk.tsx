
import Navbar from "@/components/Navbar";

import TambahStock from "@/components/StockMasuk/StockMasuk";
import { StockInReadOnly } from "@/components/StockReadOnlyHistory";
import { useAuth } from "@/hooks/auth/useAuth";



const StockMasuk = () => {
  const { isAdmin } = useAuth();

  return (
    <div>
      <Navbar title="Barang Masuk"/>

      {isAdmin ? <TambahStock /> : <StockInReadOnly />}

      {/* <SambutanCoomponent
        paragraf1="Master Barang"
        paragraf2="Kelola daftar Barang APD & Tools"
        button="+ Tambah barang"
        onclick={() => navigate("/create-items")}
      /> */}

      {/* <CardComponent /> */}
      {/* <TableItems /> */}
    </div>
  );
};

export default StockMasuk;
