const PDFDocument = require('pdfkit');
const axios = require('axios');

async function generateScanPDF(scan, res) {
  // scan: { patient_name, patient_id, scan_type, region, image_url, upload_date }
  const doc = new PDFDocument({ autoFirstPage: true });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=scan-${scan.id}.pdf`);

  doc.fontSize(18).text('OralVis - Scan Report', { align: 'center' });
  doc.moveDown();

  doc.fontSize(12).text(`Patient Name: ${scan.patient_name}`);
  doc.text(`Patient ID: ${scan.patient_id}`);
  doc.text(`Scan Type: ${scan.scan_type}`);
  doc.text(`Region: ${scan.region}`);
  doc.text(`Upload Date: ${scan.upload_date}`);
  doc.moveDown();

  // embed image (download first as buffer)
  try {
    const response = await axios.get(scan.image_url, { responseType: 'arraybuffer' });
    const imgBuffer = Buffer.from(response.data, 'binary');
    // fit image to page width
    doc.image(imgBuffer, { fit: [450, 300], align: 'center' });
  } catch (err) {
    doc.text('Unable to load image for PDF.');
  }

  doc.end();
  doc.pipe(res);
}

module.exports = { generateScanPDF };
