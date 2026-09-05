// import CardComponent from "@/components/cardCompoentn";
import Navbar from "@/components/Navbar";
import SambutanCoomponent from "@/components/SambutanCoomponent";
import { CreateSupplier } from "@/components/supplier/CreateSupplier";
import TableLayout from "@/components/supplier/TableSupplier";
import { useState } from "react";

const Supplier = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <div>
      <Navbar title="Supplier" />

      <SambutanCoomponent
        paragraf1="Master Supplier"
        paragraf2="Kelola daftar mitra supplier barang APD & Tools"
        button="+ Tambah Supplier"
        onclick={() => setIsDialogOpen(true)}
      />

      {/* artinya hanya jalankan ketika isDialogOpen */}
      <CreateSupplier
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />

      {/* <CardComponent /> */}
      <TableLayout />
    </div>
  );
};

export default Supplier;
