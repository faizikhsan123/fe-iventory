// Peta terjemahan pesan server (Laravel, berbahasa Indonesia) -> teks UI bahasa Inggris.
// Hanya untuk tampilan: isi pesan backend tidak diubah; pesan tak dikenal ditampilkan apa adanya.

const EXACT: Record<string, string> = {
  // Auth
  "email atau password salah": "Incorrect email or password",
  "logout berhasil": "Logged out successfully",
  // Contract / resign
  "kontrak berhasil diperpanjang": "Contract renewed successfully",
  "karyawan sudah nonaktif": "Employee is already inactive",
  "resign berhasil dicatat": "Resignation recorded successfully",
  "resign berhasil dijadwalkan": "Resignation scheduled successfully",
  "perpanjangan berhasil dihapus": "Renewal deleted successfully",
  "tanggal berakhir baru tidak boleh sebelum tanggal mulai kontrak":
    "The new end date cannot be before the contract start date",
  "tanggal resign tidak boleh sebelum tanggal mulai kontrak":
    "The resignation date cannot be before the contract start date",
  // CPD
  "data cpd berhasil disimpan": "CPD data saved successfully",
  // Employee
  "data employes berhasil ditambahkan": "Employee added successfully",
  "data employes berhasil diubah": "Employee updated successfully",
  "data employes berhasil dihapus": "Employee deleted successfully",
  // Group
  "data group berhasil ditambahkan": "Group added successfully",
  "data group berhasil diupdate": "Group updated successfully",
  "data group berhasil dihapus": "Group deleted successfully",
  // Invoice
  "invoice berhasil ditambahkan": "Invoice added successfully",
  "invoice berhasil diubah": "Invoice updated successfully",
  "status invoice berhasil diubah": "Invoice status updated successfully",
  "invoice berhasil dihapus": "Invoice deleted successfully",
  "dokumen berhasil diunggah": "Document uploaded successfully",
  "dokumen berhasil dihapus": "Document deleted successfully",
  // Item
  "data item berhasil ditambahkan": "Item added successfully",
  "data item berhasil diubah": "Item updated successfully",
  "data item berhasil dihapus": "Item deleted successfully",
  // MCU
  "data mcu berhasil ditambahkan": "MCU record added successfully",
  "data mcu berhasil diubah": "MCU record updated successfully",
  "data mcu berhasil dihapus": "MCU record deleted successfully",
  // Performance review
  "performance review berhasil ditambahkan": "Performance review added successfully",
  "performance review berhasil dihapus": "Performance review deleted successfully",
  // Stock
  "stok tidak mencukupi": "Insufficient stock",
  "stock berhasil ditambahkan": "Stock added successfully",
  "qty tidak bisa diturunkan: stok akan menjadi negatif (sebagian sudah keluar)":
    "Quantity cannot be decreased: stock would become negative (part of it has already been issued)",
  "qty berhasil diubah": "Quantity updated successfully",
  "qty tidak berubah": "Quantity unchanged",
  "stok tidak mencukupi untuk menaikkan qty barang keluar":
    "Insufficient stock to increase the stock-out quantity",
  "transaksi berhasil dibuat": "Transaction created successfully",
  "item berhasil ditambahkan": "Item added successfully",
  "data transaksi berhasil diubah": "Transaction updated successfully",
  "data transaksi berhasil dihapus": "Transaction deleted successfully",
  "data transactionitem berhasil diubah": "Transaction item updated successfully",
  "data transactionitem berhasil dihapus": "Transaction item deleted successfully",
  // Supplier
  "data supplier berhasil ditambahkan": "Supplier added successfully",
  "data supplier berhasil diubah": "Supplier updated successfully",
  "data supplier berhasil dihapus": "Supplier deleted successfully",
  // Training
  "data training berhasil ditambahkan": "Training added successfully",
  "data training berhasil diubah": "Training updated successfully",
  "data training berhasil dihapus": "Training deleted successfully",
  "peserta berhasil ditambahkan": "Participant added successfully",
  "data peserta berhasil diubah": "Participant updated successfully",
  "peserta berhasil dihapus": "Participant deleted successfully",
};

const PATTERNS: Array<[RegExp, string]> = [[/^Stok (.+) tidak mencukupi$/i, "Insufficient stock for $1"]];

const norm = (s: string) => s.trim().replace(/\s+/g, " ").toLowerCase();

/** Terjemahkan pesan server Indonesia ke Inggris; fallback ke teks asli. */
export const translateServerMessage = (message: string): string => {
  if (!message) return message;
  const exact = EXACT[norm(message)];
  if (exact) return exact;
  const text = message.trim();
  for (const [re, out] of PATTERNS) if (re.test(text)) return text.replace(re, out);
  return message;
};

// ---------------------------------------------------------------------------
// Activity Log: nama aktivitas & detail disimpan backend dalam bahasa Indonesia.
// ---------------------------------------------------------------------------

const ACTIVITY_NAMES: Record<string, string> = {
  login: "Login",
  logout: "Logout",
  "menambah karyawan": "Add Employee",
  "mengubah data karyawan": "Update Employee Data",
  "menghapus karyawan": "Delete Employee",
  "menambah barang": "Add Item",
  "merubah data barang": "Update Item Data",
  "menghapus barang": "Delete Item",
  "menambah stok barang": "Add Item Stock",
  "memberikan barang": "Issue Item",
  "mengubah qty barang masuk": "Update Stock In Quantity",
  "mengubah qty barang keluar": "Update Stock Out Quantity",
  "menambah supplier": "Add Supplier",
  "merubah data supplier": "Update Supplier Data",
  "menghapus supplier": "Delete Supplier",
  "perpanjang kontrak": "Renew Contract",
  "resign karyawan": "Employee Resignation",
  "jadwalkan resign karyawan": "Schedule Employee Resignation",
  "mengubah data cpd": "Update CPD Data",
  "menambah invoice": "Add Invoice",
  "mengubah invoice": "Update Invoice",
  "update status invoice": "Update Invoice Status",
  "menghapus invoice": "Delete Invoice",
  "upload dokumen invoice": "Upload Invoice Document",
  "menghapus dokumen invoice": "Delete Invoice Document",
  "menambah data mcu": "Add MCU Record",
  "mengubah data mcu": "Update MCU Record",
  "menghapus data mcu": "Delete MCU Record",
  "menambah performance review": "Add Performance Review",
};

const INVOICE_STATUS_LABELS: Record<string, string> = {
  drafting_timesheet: "Drafting Timesheet",
  waiting_approved_timesheet: "Waiting Approved Timesheet",
  waiting_quote_or_invoicing: "Waiting Quote or Invoicing",
  waiting_service_receipt: "Waiting Service Receipt",
  waiting_work_order: "Waiting Work Order",
  waiting_payment: "Waiting Payment",
  paid: "Paid",
};

const DETAIL_PATTERNS: Array<[RegExp, (m: RegExpMatchArray) => string]> = [
  [/^Berhasil login$/i, () => "Logged in successfully"],
  [/^Berhasil logout$/i, () => "Logged out successfully"],
  // Employee
  [/^Karyawan (.+) berhasil ditambahkan$/i, (m) => `Employee ${m[1]} was added`],
  [/^Data Karyawan (.+) Berhasil Dirubah$/i, (m) => `Employee ${m[1]} data was updated`],
  [/^Karyawan (.+) Berhasil Dihapus$/i, (m) => `Employee ${m[1]} was deleted`],
  // Item
  [/^Barang (.+) berhasil Ditambah$/i, (m) => `Item ${m[1]} was added`],
  [/^Data Barang (.+) Berhasil Dirubah$/i, (m) => `Item ${m[1]} data was updated`],
  [/^Barang (.+) berhasil Dihapus$/i, (m) => `Item ${m[1]} was deleted`],
  [/^Stok Barang (.+) bertambah (.+)$/i, (m) => `Stock of item ${m[1]} increased by ${m[2]}`],
  [/^Barang (.+) Diberikan Sebanyak (.+)$/i, (m) => `Item ${m[1]} issued: ${m[2]}`],
  [
    /^Qty barang masuk (.+) diubah dari (.+) menjadi (.+)$/i,
    (m) => `Stock in quantity of ${m[1]} changed from ${m[2]} to ${m[3]}`,
  ],
  [
    /^Qty barang keluar (.+) diubah dari (.+) menjadi (.+)$/i,
    (m) => `Stock out quantity of ${m[1]} changed from ${m[2]} to ${m[3]}`,
  ],
  // Supplier
  [/^Supplier (.+) berhasil Ditambah$/i, (m) => `Supplier ${m[1]} was added`],
  [/^Data Supplier (.+) Berhasil Dirubah$/i, (m) => `Supplier ${m[1]} data was updated`],
  [/^Supplier (.+) Berhasil Dihapus$/i, (m) => `Supplier ${m[1]} was deleted`],
  // Contract / resign / CPD
  [/^Kontrak (.+) diperpanjang sampai (.+)$/i, (m) => `Contract of ${m[1]} renewed until ${m[2]}`],
  [
    /^Karyawan (.+) dijadwalkan resign pada (\S+)\. Alasan: ([\s\S]*)$/i,
    (m) => `Employee ${m[1]} is scheduled to resign on ${m[2]}. Reason: ${m[3]}`,
  ],
  [
    /^Karyawan (.+) resign pada (\S+)\. Alasan: ([\s\S]*)$/i,
    (m) => `Employee ${m[1]} resigned on ${m[2]}. Reason: ${m[3]}`,
  ],
  [/^Data CPD karyawan (.+) diperbarui \((.*)\)$/i, (m) => `CPD data of employee ${m[1]} was updated (${m[2]})`],
  // Invoice
  [/^Invoice (.+) berhasil ditambahkan$/i, (m) => `Invoice ${m[1]} was added`],
  [/^Invoice (.+) berhasil diubah$/i, (m) => `Invoice ${m[1]} was updated`],
  [/^Invoice (.+) berhasil dihapus$/i, (m) => `Invoice ${m[1]} was deleted`],
  [
    /^Invoice (.+) menjadi (\S+)$/i,
    (m) => `Invoice ${m[1]} status changed to ${INVOICE_STATUS_LABELS[m[2]] ?? m[2]}`,
  ],
  [/^Dokumen (.+) invoice (.+) diunggah$/i, (m) => `${m[1]} document of invoice ${m[2]} was uploaded`],
  [/^Dokumen (.+) invoice (.+) dihapus$/i, (m) => `${m[1]} document of invoice ${m[2]} was deleted`],
  // MCU / performance review
  [/^Data MCU karyawan (.+) berhasil ditambahkan$/i, (m) => `MCU record of employee ${m[1]} was added`],
  [/^Data MCU karyawan (.+) berhasil diubah$/i, (m) => `MCU record of employee ${m[1]} was updated`],
  [/^Data MCU karyawan (.+) berhasil dihapus$/i, (m) => `MCU record of employee ${m[1]} was deleted`],
  [
    /^Performance review karyawan (.+) berhasil ditambahkan$/i,
    (m) => `Performance review of employee ${m[1]} was added`,
  ],
];

/** Nama aktivitas (kolom activity) -> Inggris; fallback teks asli. */
export const translateActivityName = (name: string | null | undefined): string => {
  if (!name) return "";
  return ACTIVITY_NAMES[norm(name)] ?? name.trim();
};

/** Detail aktivitas -> Inggris; fallback teks asli. */
export const translateActivityDetail = (detail: string | null | undefined): string => {
  if (!detail) return "";
  const text = detail.trim();
  for (const [re, fn] of DETAIL_PATTERNS) {
    const m = text.match(re);
    if (m) return fn(m);
  }
  return detail;
};
