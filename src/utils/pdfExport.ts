import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function exportToPDF(elementId: string, filename: string = 'resume.pdf') {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    // Create a clone of the element to modify for PDF export
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.width = '800px'; // Fixed width for consistent PDF output
    clone.style.padding = '40px';
    clone.style.backgroundColor = 'white';
    
    // Temporarily append clone to document for rendering
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    document.body.appendChild(clone);

    // Render to canvas
    const canvas = await html2canvas(clone, {
      scale: 2, // Higher quality
      useCORS: true, // Enable loading cross-origin images
      logging: false,
      backgroundColor: '#ffffff'
    });

    document.body.removeChild(clone);

    // Calculate dimensions
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    const pdf = new jsPDF('p', 'mm', 'a4');
    let firstPage = true;

    while (heightLeft >= 0) {
      if (!firstPage) {
        pdf.addPage();
      }
      
      const contentWidth = canvas.width;
      const contentHeight = canvas.height;
      
      // Calculate the portion of the canvas to use for this page
      const pageCanvas = document.createElement('canvas');
      const pageCtx = pageCanvas.getContext('2d');
      
      if (pageCtx) {
        pageCanvas.width = contentWidth;
        pageCanvas.height = Math.min(
          (contentWidth * (pageHeight / imgWidth)),
          contentHeight - position
        );
        
        pageCtx.drawImage(
          canvas,
          0,
          position,
          contentWidth,
          pageCanvas.height,
          0,
          0,
          contentWidth,
          pageCanvas.height
        );
        
        const pageData = pageCanvas.toDataURL('image/jpeg', 1.0);
        pdf.addImage(
          pageData,
          'JPEG',
          0,
          0,
          imgWidth,
          (pageCanvas.height * imgWidth) / pageCanvas.width
        );
      }
      
      heightLeft -= pageHeight;
      position += (contentWidth * (pageHeight / imgWidth));
      firstPage = false;
    }

    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}