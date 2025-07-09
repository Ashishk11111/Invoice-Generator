'use client';

import { useState } from 'react';
import AnimatedHomepage from './AnimatedHomepage';

export default function InvoiceForm() {

  // Bill Section Data
  const [billingData, setBillingData] = useState({
    billedTo: '',
    billingAddress: ' ',
    billingAddressCity: ' ',
    billingAddressState: ' ',
    gstNo: ' ',
    customerPO: '',
    datePO: ''
  });

  // Form Section Data
  const [formData, setFormData] = useState({
    invoiceNo: '',
    date: '',
    serialNo: '',
    DispatchedThrough: '',
    DispatchDocNo: ' ',
    DispatchedDate: '',
    VehicleNo: ' ',
    referenceNo: ' ',
    referenceDate: '',
    ModeOfTransport: ' ',
    ShippedToName: ' ',
    ShippedToAddress: ' ',
    PlaceOfSupply: ' ',
    ModeOfPayment: ' ',
    termsOfDelivery: ' ',
    destination: ''
  });

  // Descriptions logic
  type Description = {
    details: string[];
    hsnCode: string;
    quantity: string;
    unit: string;
    rate: string;
    // price: string;
    discount: string;
    [key: string]: string | string[];
  };

  type DescriptionsState = {
    [key: string]: Description;
  };
  
  const [currentPart, setCurrentPart] = useState(2);

const [descriptions, setDescriptions] = useState<DescriptionsState>({
  "Description 1": {
    details: [""],
    hsnCode: "",
    quantity: "",
    unit: "",
    rate: "",
    discount: ""
  }
});

// ✅ Add new description
const handleAddDescription = () => {
  const newKey = `Description ${currentPart}`;

  setDescriptions(prev => ({
    ...prev,
    [newKey]: {
      details: [""],
      hsnCode: "",
      quantity: "",
      unit: "",
      rate: "",
      discount: ""
    }
  }));

  setCurrentPart(prev => prev + 1); // Always increase
};

// ✅ Remove any description
const handleRemoveDescription = (descKey: string) => {
  setDescriptions(prev => {
    const updated = { ...prev };
    delete updated[descKey];
    return updated;
  });
};


  // Handle Description changes
const handleDescriptionChange = (
  descKey: string,
  field: keyof Description, // ✅ now matches the prop type
  value: string,
  index: number | null = null
) => {
  setDescriptions(prev => {
    const updated = { ...prev };
    if (!updated[descKey]) return prev;

    if (field === "details" && index !== null) {
      const detailsCopy = [...updated[descKey].details];
      detailsCopy[index] = value;
      updated[descKey] = { ...updated[descKey], details: detailsCopy };
    } else {
      updated[descKey] = { ...updated[descKey], [field]: value };
    }
    return updated;
  });
};


// Add a detail line
const handleAddDetail = (descKey: string) => {
  setDescriptions(prev => {
    const updated = { ...prev };
    if (!updated[descKey]) return prev;
    const detailsCopy = [...updated[descKey].details, ""];
    updated[descKey] = { ...updated[descKey], details: detailsCopy };
    return updated;
  });
};

// Remove a detail line
const handleRemoveDetail = (descKey: string, index: number) => {
  setDescriptions(prev => {
    const updated = { ...prev };
    const detailsCopy = [...updated[descKey].details];
    detailsCopy.splice(index, 1);
    updated[descKey] = { ...updated[descKey], details: detailsCopy };
    return updated;
  });
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBillingData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // const handlePartialSave = async () => {
  //   try {
  //     const payload = {
  //       ...formData,
  //       ...billingData,
  //       descriptions,
  //       partNumber: currentPart
  //     };

  //     const res = await fetch('/api/generate-invoice', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(payload)
  //     });

  //     console.log(res);

  //     if (!res.ok) throw new Error('Failed to generate partial invoice');

  //     const blob = await res.blob();
  //     const url = URL.createObjectURL(blob);
  //     const a = document.createElement('a');
  //     a.href = url;
  //     a.download = `invoice-part-${currentPart}.xlsx`;
  //     a.click();
  //     URL.revokeObjectURL(url);

  //     setDescriptions({
  //       "": {
  //         details: [""],
  //         quantity: "",
  //         price: "",
  //         discount: ""
  //       }
  //     });
  //     setCurrentPart(prev => prev + 1);
  //   } catch (err) {
  //     console.error(err);
  //     alert('Saving failed');
  //   }
  // };

//   const handleDownload = async () => {
//   try {
//     const payload = {
//       ...formData,
//       ...billingData,
//       descriptions
//     };

//     const res = await fetch('/api/generate-invoice', {
//       method: 'POST',
//       body: JSON.stringify(payload),
//       headers: { 'Content-Type': 'application/json' }
//     });

//     if (!res.ok) {
//       const errText = await res.text(); // read error response
//       throw new Error(errText || 'Failed to generate invoice');
//     }

//     const blob = await res.blob();
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'invoice.xlsx';
//     a.click();
//     window.URL.revokeObjectURL(url);
//   }  catch (err: any) {
//     console.error('❌ Excel generation error:', err.stack || err);

//     // No 'req' object available here; skipping request body logging.

//     alert(err.message || 'Failed to generate invoice');
//   }
// }

const handleDownload = async () => {
  try {
    const payload = {
      ...formData,
      ...billingData,
      descriptions
    };

    const res = await fetch('/api/generate-invoice', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || 'Failed to generate invoice');
    }

    const blob = await res.blob();

    // ✅ Prefer folder picker if supported
    if ('showSaveFilePicker' in window) {
      const fileHandle = await (window as any).showSaveFilePicker({
        suggestedName: 'invoice.xlsx',
        types: [
          {
            description: 'Excel File',
            accept: {
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            },
          },
        ],
      });

      const writable = await fileHandle.createWritable();
      await writable.write(blob);
      await writable.close();
    } else {
      // 🧯 Fallback: auto-download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'invoice.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    }

  } catch (err: any) {
    console.error('❌ Excel generation error:', err.stack || err);
    alert(err.message || 'Failed to generate invoice');
  }
};



  // Total description lines
  // const totalDescriptionRows = Object.values(descriptions).reduce(
  //   (acc, val) => acc + val.details.length,
  //   0
  // );

  // const MAX_DESCRIPTION_ROWS = 13;
  // const shouldShowPartialSave = totalDescriptionRows >= MAX_DESCRIPTION_ROWS;

  return (
    <>
      <AnimatedHomepage
        billingData={billingData}
        formData={formData}
        handleChange={handleChange}
        handleBillChange={handleBillChange}
        handleDownload={handleDownload}
        descriptions={descriptions}
        // descriptions2={descriptions} {/* Pass descriptions2 as required */}
        handleDescriptionChange={handleDescriptionChange}
        handleAddDescription={handleAddDescription}
        handleAddDetail={handleAddDetail}
        handleRemoveDescription={handleRemoveDescription}
        handleRemoveDetail={handleRemoveDetail}
        // handlePartialSave={handlePartialSave}
      />

      
    </>
  );
}
