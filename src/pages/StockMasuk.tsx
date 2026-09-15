
import Navbar from "@/components/Navbar";

import TambahStock from "@/components/StockMasuk/StockMasuk";



const StockMasuk = () => {

  return (
    <div>
      <Navbar title="Stock IN Barang"/>

      <TambahStock/>

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
