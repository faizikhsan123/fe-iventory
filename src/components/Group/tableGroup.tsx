import { useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import UsegetGroups from "@/hooks/Group/get";

const TableGroups = () => {
  const { data, loading, error, getGroups } = UsegetGroups();

  useEffect(() => {
    getGroups();
  }, [getGroups]);

  // flatten: group -> employes jadi satu list baris
// flatten
const rows = data.flatMap((group) =>
  (group.employees ?? []).map((emp) => ({ group, emp }))
);

  if (loading) return <p className="p-4">Memuat data...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div>
      <Table className="min-w-[860px]">
        <TableHeader>
          <TableRow className="bg-[#DBE2EF] hover:bg-[#DBE2EF]">
            <TableHead className="px-4 font-bold text-[#112D4E] lg:px-6">No</TableHead>
            <TableHead className="px-4 font-bold text-[#112D4E] lg:px-6">Group</TableHead>
            <TableHead className="px-4 font-bold text-[#112D4E] lg:px-6">Jam Kerja</TableHead>
            <TableHead className="px-4 font-bold text-[#112D4E] lg:px-6">Karyawan</TableHead>
            <TableHead className="px-4 font-bold text-[#112D4E] lg:px-6">Divisi</TableHead>
            <TableHead className="px-4 font-bold text-[#112D4E] lg:px-6">Posisi</TableHead>
            <TableHead className="px-4 font-bold text-[#112D4E] lg:px-6">Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="py-6 text-center text-[#50688C]">
                Belum ada data
              </TableCell>
            </TableRow>
          )}

          {rows.map(({ group, emp }, index) => (
            <TableRow
              key={`${group.id}-${emp.id}`}
              className="border-[#DBE2EF] text-[#112D4E] transition-colors hover:bg-[#F9F7F7]"
            >
              <TableCell className="px-4 py-4 lg:px-6">{index + 1}</TableCell>
              <TableCell className="px-4 py-4 lg:px-6">{group.group_name}</TableCell>
              <TableCell className="px-4 py-4 lg:px-6">
                {group.start_time.slice(0, 5)} - {group.end_time.slice(0, 5)}
              </TableCell>
              <TableCell className="px-4 py-4 lg:px-6">{emp.user?.name ?? "-"}</TableCell>
              <TableCell className="px-4 py-4 lg:px-6">{emp.division ?? "-"}</TableCell>
              <TableCell className="px-4 py-4 lg:px-6">{emp.position ?? "-"}</TableCell>
              <TableCell className="px-4 py-4 lg:px-6">{emp.status ?? "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableGroups;