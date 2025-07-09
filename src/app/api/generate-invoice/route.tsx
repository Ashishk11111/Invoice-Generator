import { ToWords } from 'to-words';


// Border Application
const applyBorderToArea = (
  sheet: ExcelJS.Worksheet,
  startRow: number,
  endRow: number,
  startCol: number,
  endCol: number
) => {
  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
      const cell = sheet.getCell(row, col);
      const existing = cell.border || {};

      cell.border = {
        top: row === startRow ? { style: 'thin' } : existing.top,
        bottom: row === endRow ? { style: 'thin' } : existing.bottom,
        left: col === startCol ? { style: 'thin' } : existing.left,
        right: col === endCol ? { style: 'thin' } : existing.right,
      };
    }
  }
};



const toWords = new ToWords({
  localeCode: 'en-IN',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
  },
});

// 👇 Returns: RUPEES ONE THOUSAND ONLY
export const convertToRupeesInWords = (amount: number): string => {
  return (toWords.convert(amount, { currency: true }) || "").toUpperCase();
};

// 👇 Returns: ONE THOUSAND TWO HUNDRED THIRTY-FOUR
export const convertNumberInWords = (amount: number): string => {
  return (toWords.convert(amount, { currency: false }) || "").toUpperCase();
};
import ExcelJS from 'exceljs';
import path from 'path';
import { readFileSync } from 'fs';

export const runtime = 'nodejs';

// Cloning Sheet
function cloneWorksheet(
  workbook: ExcelJS.Workbook,
  templateSheet: ExcelJS.Worksheet,
  newSheetName: string
): ExcelJS.Worksheet {
  const newSheet = workbook.addWorksheet(newSheetName);

  // Clone columns
  if (templateSheet.columns) {
    newSheet.columns = templateSheet.columns.map(col => ({
      key: col?.key,
      width: col?.width,
      style: { ...col?.style },
    }));
  }

  // Clone rows & styles
  const rowHeights: Record<number, number> = {
    1: 541
    // define more if needed
  };

  templateSheet.eachRow((row, rowNumber) => {
    const newRow = newSheet.getRow(rowNumber);

    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      const newCell = newRow.getCell(colNumber);
      newCell.value = cell.value;
      newCell.style = { ...cell.style };
    });

    // ✅ Force height from map
    if (rowHeights[rowNumber]) {
      newRow.height = (rowHeights[rowNumber] / 96) * 72;
    }

    newRow.commit();
  });


  // Clone merged cells
  const merges = templateSheet.model?.merges;
  if (Array.isArray(merges)) {
    for (const range of merges) {
      newSheet.mergeCells(range);
    }
  }

  // ✅ Clone images
  // ✅ Add 2 images
  const logoBuffer = readFileSync(path.join(process.cwd(), 'public/templates/letterhead.png'));
  // const stampBuffer = readFileSync(path.join(process.cwd(), 'public/templates/watermark.png'));

  const logoId = workbook.addImage({ buffer: logoBuffer, extension: 'png' });
  // const stampId = workbook.addImage({ buffer: stampBuffer, extension: 'png' });

  newSheet.addImage(logoId, {
    tl: { col: 0, row: 0 },
    br: { col: 15, row: 1 },
    editAs: 'twoCell'
  });

  // newSheet.addImage(stampId, {
  //   tl: { col: 3, row: 5 },
  //   ext: { width: 888, height: 960 }
  // });

  return newSheet;
}

type DescriptionEntry = {
  details: string[];
  hsnCode: number;
  quantity: number;
  unit: number;
  rate: number;
  discount: number;
};

type Descriptions = {
  [key: string]: DescriptionEntry;
};

export async function POST(req: Request) {
  try {
    const {
      invoiceNo,
      date,
      customerPO,
      datePO,
      referenceNo,
      referenceDate,
      ModeOfTransport,
      DispatchDocNo,
      VehicleNo,
      DispatchedThrough,
      DispatchedDate,
      billedTo,
      ShippedTo,
      PlaceOfSupply,
      ModeOfPayment,
      shipingAddress,
      billingAddress,
      billingAddressCity,
      billingAddressState,
      gstNo,
      termsOfDelivery,
      destination,
      descriptions,
    }: {
      invoiceNo: string;
      date: string;
      serialNo: string;
      customerPO: string;
      datePO: string;
      referenceNo: string;
      referenceDate: string;
      ModeOfTransport: string;
      DispatchDocNo: string;
      VehicleNo: string;
      DispatchedThrough: string;
      DispatchedDate: string;
      billedTo: string;
      ShippedTo: string;
      PlaceOfSupply: string;
      ModeOfPayment: string;
      shipingAddress: string;
      billingAddress: string;
      billingAddressCity: string;
      billingAddressState: string;
      gstNo: string;
      termsOfDelivery: string;
      destination: string;
      descriptions: Descriptions;
    } = await req.json();

    const templatePath = path.join(process.cwd(), 'public', 'templates', 'invoice_template.xlsx');
    const templateBuffer = readFileSync(templatePath);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(templateBuffer);

    // Try by name first
    let templateSheet = workbook.getWorksheet('Invoice Template');

    // Fallback to first sheet
    if (!templateSheet) {
      templateSheet = workbook.worksheets[0];
    }

    if (!templateSheet) throw new Error('Invoice Template sheet not found');

    let sheetIndex = 1;
    let sheet = cloneWorksheet(workbook, templateSheet, `Sheet${sheetIndex}`); // ✅ Clean copy

    let currentRow = 17;
    let serial = 1;
    const maxRowsPerSheet = 12;

    // Header Details
    const writeHeader = (targetSheet: ExcelJS.Worksheet) => {
      targetSheet.getCell('H3').value = `invoiceNo ME / INV / 25-26 /${invoiceNo}`;
      targetSheet.getCell('N4').value = ` ${date}`;
      targetSheet.getCell('H4').value = `Serial no.of ${customerPO}`;
      targetSheet.getCell('N5').value = `Dated ${datePO}`;
      targetSheet.getCell('H7').value = `Reference No&  Date ${referenceNo} ${referenceDate}`;
      targetSheet.getCell('N7').value = `date of Transport : ${ModeOfTransport}`;
      targetSheet.getCell('H8').value = `Dispatch Doc No. ${DispatchDocNo}`;
      targetSheet.getCell('N8').value = `Veh.No : ${VehicleNo}`;
      targetSheet.getCell('H9').value = `Dispatched Through ${DispatchedThrough}`;
      targetSheet.getCell('N9').value = `Dated ${DispatchedDate}`;
      targetSheet.getCell('A10').value = `Details of Receiver ( Billed to) ${billedTo}`;
      targetSheet.getCell('A11').value = `Consignee Name : ${billedTo}`;
      targetSheet.getCell('A12').value = billingAddress;
      targetSheet.getCell('A13').value = `${billingAddressCity} ${billingAddressState}`;
      targetSheet.getCell('J10').value = `Details of Consignee  Shipped To:`;
      targetSheet.getCell('J11').value = `Name: ${ShippedTo}`;
      targetSheet.getCell('J12').value = `Address : ${shipingAddress}`;
      targetSheet.getCell('N13').value = PlaceOfSupply;
      targetSheet.getCell('A14').value = `GSTIN/UIN: ${gstNo}`;
      targetSheet.getCell('N11').value = ` ${ModeOfPayment}`;
      targetSheet.getCell('L15').value = `${termsOfDelivery}`;
      targetSheet.getCell('O15').value = `${destination}`;
    };

    writeHeader(sheet);

    // const logoBuffer = readFileSync(path.join(process.cwd(), 'public/templates/letterhead.png'));
    // const stampBuffer = readFileSync(path.join(process.cwd(), 'public/templates/watermark.png'));

    // const logoId = workbook.addImage({ buffer: logoBuffer, extension: 'png' });
    // const stampId = workbook.addImage({ buffer: stampBuffer, extension: 'png' });

    // sheet.addImage(logoId, {
    //   tl: { col: 0, row: 0 },
    //   ext: { width: 1323, height: 363 }
    // });

    // sheet.addImage(stampId, {
    //   tl: { col: 3, row: 5 },
    //   ext: { width: 888, height: 960 }
    // });

    let SumTaxableValue = 0;
    let SumGST = 0;
    const descriptionEntries = Object.entries(descriptions)
      .filter(([key, val]) => key.trim() !== "" && val.details.some(d => d.trim() !== ""));

    for (let descIndex = 0; descIndex < descriptionEntries.length; descIndex++) {
      const [_,entry] = descriptionEntries[descIndex];
      const { details, hsnCode, quantity, unit, rate, discount } = entry;
      
      // console.log(entry)
      // console.log(descriptionEntries.length)
      let hasWrittenSerial = false;

      for (let i = 0; i < details.length; i++) {
        if ((currentRow - 17) >= maxRowsPerSheet) {
          sheetIndex++;
          const newSheetName = `Sheet${sheetIndex}`;
          sheet = cloneWorksheet(workbook, templateSheet, newSheetName);
          currentRow = 17;
          writeHeader(sheet);
        }

        const row = sheet.getRow(currentRow++);
        row.getCell(1).value = hasWrittenSerial ? '' : serial;  // ✅ use actual serial number

        row.getCell(3).value = details[i];
        row.getCell(8).value = hasWrittenSerial ? '' : hsnCode;
        row.getCell(9).value = hasWrittenSerial ? '' : quantity;
        row.getCell(10).value = hasWrittenSerial ? '' : unit;
        row.getCell(11).value = hasWrittenSerial ? '' : rate;
        row.getCell(12).value = hasWrittenSerial ? '' : discount;

        // Total Amount
        // const qty = Number(row.getCell(9).value) || 0;
        // const rt = Number(row.getCell(11).value) || 0;
        const totalAmt = quantity * rate;
        row.getCell(13).value = hasWrittenSerial ? '' : totalAmt;

        // Taxable Value
        // const Dis = Number(row.getCell(12).value) || 0;
        // const Tamt = Number(row.getCell(13).value) || 0;
        const TaxableAmt = totalAmt - discount;
        row.getCell(14).value = hasWrittenSerial ? '' : TaxableAmt;

        // GST 18%

        row.getCell(15).value = hasWrittenSerial ? '' : (TaxableAmt) * 0.18;

        SumTaxableValue += (TaxableAmt)
        SumGST += ((TaxableAmt) * 0.18);
        hasWrittenSerial = true;
      }

      serial++; // ✅ advance only after entire entry is processed
    }

    workbook.removeWorksheet(templateSheet.id);

    const sheets = workbook.worksheets;

    const lastSheet = sheets[sheets.length - 1];
    const remainingSheets = sheets.slice(0, sheets.length - 1);

    // 🔁 Loop through remaining sheets
    function clearCells(sheet: ExcelJS.Worksheet, cellUpdates: { row: number, cells: number[] }[]) {
      for (const { row: rowNumber, cells } of cellUpdates) {
        const row = sheet.getRow(rowNumber);
        for (const cell of cells) {
          row.getCell(cell).value = '';
        }
        row.commit();
      }
    }

    // Apply to remainingSheets
    for (const sheet of remainingSheets) {
      applyBorderToArea(sheet,1,45,1,15);
      clearCells(sheet, [
        { row: 29, cells: [11, 14, 15] },
        { row: 30, cells: [1, 11, 14, 15] },
        { row: 31, cells: [1, 12, 14] },
        { row: 32, cells: [1, 14] },
        // { row: 34, cells: [12, 13, 14, 15] }, // Uncomment if needed
        { row: 35, cells: [14, 15] },
      ]);
    }

    // ✅ Handle lastSheet separately

    // Row 30
    let row = lastSheet.getRow(30);
    row.getCell(14).value = SumTaxableValue;
    row.getCell(15).value = SumGST;
    row.commit();

    // Row 32
    row = lastSheet.getRow(32);
    const GrandTotal = SumTaxableValue + SumGST;
    const words = convertToRupeesInWords(GrandTotal);
    row.getCell(1).value = `Indian Rupees : ${words}`;
    row.getCell(14).value = GrandTotal;
    row.commit();

    // Row 35
    row = lastSheet.getRow(35);
    row.getCell(12).value = SumTaxableValue;
    row.getCell(14).value = SumTaxableValue * 0.18;
    row.getCell(15).value = SumTaxableValue;
    row.commit();

    // Row 36
    row = lastSheet.getRow(36);
    row.getCell(14).value = SumTaxableValue * 0.18;
    row.getCell(15).value = SumTaxableValue;
    row.commit();

    applyBorderToArea(lastSheet,1,45,1,15);

    

    const outputBuffer = await workbook.xlsx.writeBuffer();
    // console.log("Hello")
    return new Response(outputBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=invoice.xlsx',
      },
    });

  } catch (err: any) {
    console.error('❌ Excel generation error:', err.stack || err);

    // Helpful to log full request body if possible
    try {
      const bodyText = await req.text();
      console.error('📦 Request body (raw):', bodyText);
    } catch{ }

    return new Response(JSON.stringify({ error: err.message || 'Failed to generate invoice' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
