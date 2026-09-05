import CreateEmployes from "@/components/employes/CreateEmployes";
import TableEmployes from "@/components/employes/TableEmployes";
import Navbar from "@/components/Navbar";
import SambutanCoomponent from "@/components/SambutanCoomponent";
import useGetEmployes from "@/hooks/employes/getEmployes";
import { useState } from "react";

const Employes = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { getEmployesButton } = useGetEmployes();

  return (
    <div>
      <Navbar title="Employes"></Navbar>

      <SambutanCoomponent
        paragraf1="Master Employes"
        paragraf2="Data karyawan yang dapat mengakses inventaris"
        button="+ Tambah Karyawan"
        onclick={() => setIsDialogOpen(true)}
      />

      <CreateEmployes
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={() => getEmployesButton()}
      />

      <TableEmployes />
    </div>
  );
};

export default Employes;
