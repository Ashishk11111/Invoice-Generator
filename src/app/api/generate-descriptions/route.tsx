// import ExcelJS from 'exceljs';

// export const runtime = 'nodejs';

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     const workbook = new ExcelJS.Workbook();
//     let sheetIndex = 1;
//     let sheet = workbook.addWorksheet(`Sheet${sheetIndex}`);

//     const maxRowsPerSheet = 13;
//     let currentRow = 17;
//     let serial = 1;

//     // Header Row for first sheet
//     // sheet.getRow(16).values = ['S.No', 'Description', 'Quantity', 'Price', 'Discount'];

//     for (const [description, values] of Object.entries(body)) {
//       const { details, quantity, price, discount } = values;
//       const rowsNeeded = details.length;
//       const remainingRows = maxRowsPerSheet - (currentRow - 17);

//       // If not enough space left for full description, start a new sheet
//       if (rowsNeeded > remainingRows) {
//         sheetIndex++;
//         sheet = workbook.addWorksheet(`Sheet${sheetIndex}`);
//         currentRow = 17;
//         sheet.getRow(16).values = ['S.No', 'Description', 'Quantity', 'Price', 'Discount'];
//       }

//       for (let i = 0; i < details.length; i++) {
//         const row = sheet.getRow(currentRow++);
//         row.getCell(1).value = i === 0 ? serial : ''; // Serial No only on first line
//         row.getCell(2).value = details[i];
//         row.getCell(3).value = quantity;
//         row.getCell(4).value = price;
//         row.getCell(5).value = discount;
//       }

//       serial++;
//     }

//     const buffer = await workbook.xlsx.writeBuffer();

//     return new Response(buffer, {
//       status: 200,
//       headers: {
//         'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//         'Content-Disposition': 'attachment; filename=descriptions.xlsx',
//       },
//     });
//   } catch (error) {
//     console.error('Excel generation error:', error);
//     return new Response(JSON.stringify({ error: 'Failed to generate file' }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }
// }



import ExcelJS from 'exceljs';
import path from 'path';
import { readFileSync } from 'fs';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    type DescriptionEntry = {
      details: string[];
      quantity: string;
      price: string;
      discount: string;
    };

    const {
      invoiceNo,
      date,
      serialNo,
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
      ShippedToName,
      ShippedToAddress,
      PlaceOfSupply,
      ModeOfPayment,
      billingAddress,
      billingAddressCity,
      billingAddressState,
      gstNo,
      termsOfDelivery,
      destination,
      descriptions,
      partNumber,
    } = await req.json() as {
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
      ShippedToName: string;
      ShippedToAddress: string;
      PlaceOfSupply: string;
      ModeOfPayment: string;
      billingAddress: string;
      billingAddressCity: string;
      billingAddressState: string;
      gstNo: string;
      termsOfDelivery: string;
      destination: string;
      partNumber: number;
      descriptions: { [key: string]: DescriptionEntry };
    };

    const templatePath = path.join(process.cwd(), 'public', 'templates', 'invoice_template.xlsx');
    const buffer = readFileSync(templatePath);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);

    const sheet = workbook.getWorksheet(1);
    if (!sheet) {
      return new Response(JSON.stringify({ error: 'Worksheet not found' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Static data insert
    sheet.getCell('H3').value = `Invoice No: ME / INV / 25-26 /${invoiceNo} (Part ${partNumber})`;
    sheet.getCell('N4').value = ` ${date}`;
    sheet.getCell('H4').value = `Serial No: ${customerPO}`;
    sheet.getCell('N5').value = `Dated ${datePO}`;
    sheet.getCell('H7').value = `Reference No & Date: ${referenceNo} ${referenceDate}`;
    sheet.getCell('N7').value = `Mode of Transport: ${ModeOfTransport}`;
    sheet.getCell('H8').value = `Dispatch Doc No: ${DispatchDocNo}`;
    sheet.getCell('N8').value = `Veh. No: ${VehicleNo}`;
    sheet.getCell('H9').value = `Dispatched Through: ${DispatchedThrough}`;
    sheet.getCell('N9').value = `Dated: ${DispatchedDate}`;
    sheet.getCell('A10').value = `Details of Receiver (Billed To): ${billedTo}`;
    sheet.getCell('A11').value = `Consignee Name: ${billedTo}`;
    sheet.getCell('A12').value = billingAddress;
    sheet.getCell('A13').value = `${billingAddressCity}, ${billingAddressState}`;
    sheet.getCell('J10').value = `Details of Consignee (Shipped To):`;
    sheet.getCell('J11').value = `Name: ${ShippedToName}`;
    sheet.getCell('J12').value = `Address: ${ShippedToAddress}`;
    sheet.getCell('N13').value = PlaceOfSupply;
    sheet.getCell('A14').value = `GSTIN/UIN: ${gstNo}`;
    sheet.getCell('N11').value = ModeOfPayment;
    sheet.getCell('L15').value = termsOfDelivery;
    sheet.getCell('O15').value = destination;

    // Insert descriptions
    let rowIndex = 17;
    let serial = 1;

    for (const [descKey, values] of Object.entries(descriptions)) {
      const { details, quantity, price, discount } = values;
      for (let i = 0; i < details.length; i++) {
        const row = sheet.getRow(rowIndex++);
        row.getCell(1).value = i === 0 ? serial : '';
        row.getCell(3).value = details[i];
        row.getCell(9).value = quantity;
        row.getCell(11).value = price;
        row.getCell(12).value = discount;
      }
      serial++;
    }

    const outputBuffer = await workbook.xlsx.writeBuffer();

    return new Response(outputBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=invoice-part-${partNumber}.xlsx`,
      },
    });

  } catch (err) {
    console.error('Excel generation error:', err);
    return new Response(JSON.stringify({ error: 'Failed to generate invoice' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
