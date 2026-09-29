import Navbar from "@/components/Navbar";
import SambutanComponent from "@/components/SambutanCoomponent";

import { CreateSupplier } from "@/components/supplier/CreateSupplier";
import TableSupplier from "@/components/supplier/TableSupplier";
import { useState } from "react";

const Supplier = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div>
      <Navbar title="Supplier" />

      <SambutanComponent
        paragraf1="Master Supplier"
        paragraf2="Kelola daftar mitra supplier barang APD & Tools"
        button="+ Tambah Supplier"
        onclick={() => setIsDialogOpen(true)}
      />

      <CreateSupplier
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={() => setRefreshKey((k) => k + 1)}
      />

      <TableSupplier refreshKey={refreshKey} />
    </div>
  );
};

export default Supplier;