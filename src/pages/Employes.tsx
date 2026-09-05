import TableEmployes from "@/components/employes/TableEmployes";
import Navbar from "@/components/Navbar";
import SambutanCoomponent from "@/components/SambutanCoomponent";
import React from "react";

const Employes = () => {
  //  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <div>
      <Navbar title="Employes"></Navbar>

      <SambutanCoomponent
        paragraf1="Master Employes"
        paragraf2="Data karyawan yang dapat mengakses inventaris"
        button="+ Tambah Karyawan"
        // onclick={() => setIsDialogOpen(true)}
      />

      <TableEmployes />
    </div>
  );
};

export default Employes;
