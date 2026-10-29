import Navbar from "@/components/Navbar";
import SambutanComponent from "@/components/SambutanCoomponent";
import TableContract from "@/components/Contract/TableContract";

const ContractPage = () => {
  return (
    <div>
      <Navbar title="Contract" />

      <SambutanComponent
        paragraf1="Employee Contracts"
        paragraf2="Manage contract renewals and employee performance reviews"
      />

      <TableContract />
    </div>
  );
};

export default ContractPage;
