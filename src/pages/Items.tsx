import TableItems from "@/components/items/TableItems";
import Navbar from "@/components/Navbar";
import SambutanCoomponent from "@/components/SambutanCoomponent";
import React from "react";

const Items = () => {
  return (
    <div>
      <Navbar title="Barang" />

      <SambutanCoomponent
        paragraf1="Master Barang"
        paragraf2="Kelola daftar Barang APD & Tools"
        button="+ Tambah barang"

      />

      {/* <CardComponent /> */}
      <TableItems />
    </div>
  );
};

export default Items;
