import Navbar from "@/components/Navbar";
import SambutanComponent from "@/components/SambutanCoomponent";

import { CreateSupplier } from "@/components/supplier/CreateSupplier";
import TableSupplier from "@/components/supplier/TableSupplier";
import { useState } from "react";
import { useAuth } from "@/hooks/auth/useAuth";

const Supplier = () => {
  const { isAdmin } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div>
      <Navbar title="Supplier" />

      <SambutanComponent
        paragraf1="Master Supplier"
        paragraf2="Kelola daftar mitra supplier barang APD & Tools"
        button={isAdmin ? "+ Tambah Supplier" : undefined}
        onclick={isAdmin ? () => setIsDialogOpen(true) : undefined}
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