import CreateEmployes from "@/components/employes/CreateEmployes";
import TableEmployes from "@/components/employes/TableEmployes";
import Navbar from "@/components/Navbar";
import SambutanComponent from "@/components/SambutanCoomponent";

import { useState } from "react";

const Employes = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div>
      <Navbar title="Employees"></Navbar>

      <SambutanComponent
        paragraf1="Master Employees"
        paragraf2="Kelola  Data karyawan "
        button="+ Tambah Karyawan"
        onclick={() => setIsDialogOpen(true)}
      />

      <CreateEmployes
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={() => setRefreshKey((k) => k + 1)}
      />

      <TableEmployes refreshKey={refreshKey} />
    </div>
  );
};

export default Employes;