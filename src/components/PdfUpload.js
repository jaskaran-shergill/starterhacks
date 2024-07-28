import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { pdfjs } from 'react-pdf';
import { Document, Page } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function PdfUpload() {
  const { setSelectedFile, setExtractedText } = useContext(AppContext);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const pdf = await pdfjs.getDocument(e.target.result).promise;
          const totalPages = pdf.numPages;
          let extractedText = '';
          for (let i = 1; i <= totalPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            extractedText += textContent.items.map(item => item.str).join(' ');
          }
          setExtractedText(extractedText);
        } catch (error) {
          console.error('Error parsing PDF:', error);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      {numPages && (
        <div>
          <p>Page {pageNumber} of {numPages}</p>
          <Document file={selectedFile} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} />
          </Document>
          <button
            type="button"
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber(pageNumber - 1)}
          >
            Previous
          </button>
          <button
            type="button"
            disabled={pageNumber >= numPages}
            onClick={() => setPageNumber(pageNumber + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default PdfUpload;
