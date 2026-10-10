import Navbar from "@/components/Navbar";
import SambutanComponent from "@/components/SambutanCoomponent";
import TableContract from "@/components/Contract/TableContract";

const ContractPage = () => {
  return (
    <div>
      <Navbar title="Contract" />

      <SambutanComponent
        paragraf1="Contract Karyawan"
        paragraf2="Kelola perpanjangan kontrak dan performance review karyawan"
      />

      <TableContract />
    </div>
  );
};

export default ContractPage;
