
// This assumes jspdf is loaded from a CDN and available on the window object
declare global {
  interface Window {
    jspdf: any;
  }
}

export const generatePdf = async (coverImage: string, pageImages: string[], childName: string, theme: string): Promise<string> => {
  const { jsPDF } = window.jspdf;
  // A4 size in points: 595.28 x 841.89
  const doc = new jsPDF('p', 'pt', 'a4');

  const addImageToPage = (imgData: string) => {
    const img = new Image();
    img.src = imgData;
    return new Promise<void>((resolve) => {
      img.onload = () => {
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 40;
        const usableWidth = pageWidth - 2 * margin;
        const usableHeight = pageHeight - 2 * margin;
        
        const imgRatio = img.width / img.height;
        const pageRatio = usableWidth / usableHeight;

        let imgWidth, imgHeight;
        if (imgRatio > pageRatio) {
          imgWidth = usableWidth;
          imgHeight = imgWidth / imgRatio;
        } else {
          imgHeight = usableHeight;
          imgWidth = imgHeight * imgRatio;
        }

        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2;
        
        doc.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
        resolve();
      };
    });
  };

  // Add cover page
  await addImageToPage(coverImage);
  
  // Add coloring pages
  for (const pageImage of pageImages) {
    doc.addPage();
    await addImageToPage(pageImage);
  }

  const pdfBlob = doc.output('blob');
  return URL.createObjectURL(pdfBlob);
};
