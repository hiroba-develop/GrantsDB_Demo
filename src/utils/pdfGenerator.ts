import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { type Customer, type Subsidy } from '../data/db';
import { createRoot } from 'react-dom/client';
import { ProposalDocument } from '../components/ProposalDocument';
import React from 'react';

export const generateProposalPDFfromHTML = async (customer: Customer, subsidy: Subsidy): Promise<jsPDF> => {
  // 1. Create a temporary container for rendering the component
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px'; // Position off-screen
  document.body.appendChild(container);

  try {
    // 2. Render the React component into the container
    const root = createRoot(container);
    root.render(React.createElement(ProposalDocument, { customer, subsidy }));

    // Wait a short moment for the browser to render the component
    await new Promise(resolve => setTimeout(resolve, 100));

    // 3. Use html2canvas to capture the rendered component as an image
    const elementToCapture = container.querySelector('#proposal-document') as HTMLElement;
    if (!elementToCapture) {
        throw new Error("PDF generation failed: Could not find the proposal document element to capture.");
    }
    const canvas = await html2canvas(elementToCapture, {
      scale: 2, // Increase resolution for better quality
      useCORS: true,
    });

    // 4. Create a PDF and add the image
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    // const pdfHeight = pdf.internal.pageSize.getHeight(); // Not used but good to have
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = imgWidth / imgHeight;
    const newImgWidth = pdfWidth;
    const newImgHeight = newImgWidth / ratio;

    pdf.addImage(imgData, 'PNG', 0, 0, newImgWidth, newImgHeight);
    
    return pdf;

  } finally {
    // 5. Clean up the temporary container
    document.body.removeChild(container);
  }
};
