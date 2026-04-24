/**
 * SHARED PDF GENERATOR — Heritage Health Services
 * Provides unified logic for filling and signing clinical forms.
 */

export async function generateClientPacket(data) {
    const { PDFDocument, rgb, StandardFonts } = PDFLib;
    const attachments = [];

    // Helper to load and fill a PDF
    async function processPDF(fileName, drawLogic) {
        const url = `./${fileName}`;
        const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        
        let sigImage = null;
        if (data.signature) {
            try {
                sigImage = await pdfDoc.embedPng(data.signature);
            } catch (e) {
                console.error("Signature embedding failed", e);
            }
        }

        drawLogic(firstPage, font, sigImage, rgb);
        
        const pdfBytes = await pdfDoc.save();
        const pdfBase64 = await pdfDoc.saveAsBase64({ dataUri: false });
        
        attachments.push({
            name: fileName.replace('.pdf', '_Signed.pdf'),
            data: pdfBase64,
            bytes: pdfBytes
        });
    }

    // 1. Referral Form
    await processPDF('New-Client-Referral2017.pdf', (page, font, sig, rgb) => {
        const { height } = page.getSize();
        const draw = (text, x, y, size = 10) => {
            if (text) page.drawText(String(text), { x, y: height - y, size, font });
        };
        
        draw(new Date(data.submittedAt?.seconds * 1000 || Date.now()).toLocaleDateString(), 550, 195);
        draw(`${data.lastName}, ${data.firstName}`, 100, 255);
        draw(data.ssn, 70, 272);
        draw(data.pcwPhone, 450, 272);
        draw(data.dob, 70, 305);
        draw(data.language, 420, 305);
        draw(data.gender, 760, 305);
        draw(data.address, 130, 345);
        draw(data.city, 400, 345);
        draw(data.zip, 720, 345);
        draw(data.medicaidNumber, 150, 395);
        draw(data.doctorName, 170, 415);
        draw(data.doctorLocation, 600, 415);
        draw(data.pcwName, 200, 855);
    });

    // 2. Medical Release
    await processPDF('Medical-Release2017.pdf', (page, font, sig, rgb) => {
        const { height } = page.getSize();
        const draw = (text, x, y, size = 11) => {
            if (text) page.drawText(String(text), { x, y: height - y, size, font });
        };
        draw(data.doctorName, 300, 420);
        draw(new Date(data.submittedAt?.seconds * 1000 || Date.now()).toLocaleDateString(), 420, 695);
        draw(`${data.firstName} ${data.lastName}`, 300, 755);
        draw(data.dob, 200, 868);
        draw(data.pcwPhone, 600, 868);
        if (sig) page.drawImage(sig, { x: 300, y: height - 820, width: 150, height: 40 });
    });

    // 3. Wheaton Release
    await processPDF('Medical-Rec-Release-Wheaton.pdf', (page, font, sig, rgb) => {
        const { height } = page.getSize();
        const draw = (text, x, y, size = 10) => {
            if (text) page.drawText(String(text), { x, y: height - y, size, font });
        };
        draw(data.lastName, 100, 82);
        draw(data.firstName, 550, 82);
        draw(data.address + ", " + data.city + ", WI " + data.zip, 100, 115);
        draw(data.dob, 100, 142);
        draw(data.gender, 250, 142);
        draw(data.pcwPhone, 550, 142);
        draw(new Date(data.submittedAt?.seconds * 1000 || Date.now()).toLocaleDateString(), 820, 755);
        if (sig) page.drawImage(sig, { x: 250, y: height - 765, width: 150, height: 40 });
    });

    return attachments;
}
