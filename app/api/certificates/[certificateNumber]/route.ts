import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";
import { findCertificateByNumber } from "@/lib/admin-repository";
import { academy } from "@/lib/site-data";

const pageWidth = 1536;
const pageHeight = 1024;
const emerald = rgb(0.05, 0.25, 0.21);
const emeraldSoft = rgb(0.09, 0.33, 0.26);
const ivory = rgb(0.98, 0.95, 0.88);
const charcoal = rgb(0.18, 0.18, 0.18);

export async function GET(
  _request: Request,
  context: { params: Promise<{ certificateNumber: string }> },
) {
  const { certificateNumber } = await context.params;
  const certificate = await findCertificateByNumber(certificateNumber);

  if (!certificate) {
    return NextResponse.json(
      { message: "Certificate not found." },
      { status: 404 },
    );
  }

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([pageWidth, pageHeight]);

  const serif = await pdf.embedFont(StandardFonts.TimesRoman);
  const serifBold = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const serifItalic = await pdf.embedFont(StandardFonts.TimesRomanItalic);
  const sans = await pdf.embedFont(StandardFonts.Helvetica);
  const sansBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const templateBytes = await readFile(
    join(process.cwd(), "public", "certificate-template-blank.png"),
  );
  const template = await pdf.embedPng(templateBytes);

  const verificationUrl = `${academy.websiteUrl}/verify?certificate=${encodeURIComponent(certificate.certificateNumber)}`;
  const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
    margin: 0,
    width: 240,
    color: {
      dark: "#103D33",
      light: "#FFF8EF",
    },
  });
  const qr = await pdf.embedPng(Buffer.from(qrDataUrl.split(",")[1], "base64"));

  page.drawImage(template, {
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight,
  });

  const studentNameSize = fitFontSize(
    certificate.studentName,
    serifItalic,
    70,
    40,
    700,
  );
  const courseNameSize = fitFontSize(
    certificate.courseTitle,
    serifBold,
    38,
    22,
    760,
  );

  page.drawText("THIS CERTIFICATE IS PROUDLY PRESENTED TO", {
    x: centerText(pageWidth, serif, 20, "THIS CERTIFICATE IS PROUDLY PRESENTED TO"),
    y: 548,
    size: 20,
    font: serif,
    color: charcoal,
  });

  page.drawText(certificate.studentName, {
    x: centerText(pageWidth, serifItalic, studentNameSize, certificate.studentName),
    y: 448,
    size: studentNameSize,
    font: serifItalic,
    color: emerald,
  });

  page.drawText("FOR SUCCESSFULLY COMPLETING THE COURSE", {
    x: centerText(
      pageWidth,
      serif,
      17,
      "FOR SUCCESSFULLY COMPLETING THE COURSE",
    ),
    y: 392,
    size: 17,
    font: serif,
    color: charcoal,
  });

  page.drawText(certificate.courseTitle, {
    x: centerText(pageWidth, serifBold, courseNameSize, certificate.courseTitle),
    y: 344,
    size: courseNameSize,
    font: serifBold,
    color: emeraldSoft,
  });

  const blessingLineOne =
    "We pray that Allah (SWT) accepts this achievement and grants success in this life";
  const blessingLineTwo = "and the Hereafter. Ameen.";

  page.drawText(blessingLineOne, {
    x: centerText(pageWidth, serif, 14, blessingLineOne),
    y: 284,
    size: 14,
    font: serif,
    color: charcoal,
  });
  page.drawText(blessingLineTwo, {
    x: centerText(pageWidth, serif, 14, blessingLineTwo),
    y: 262,
    size: 14,
    font: serif,
    color: charcoal,
  });

  page.drawText("CERTIFICATE ID", {
    x: 1168,
    y: 846,
    size: 15,
    font: serif,
    color: charcoal,
  });
  page.drawText(certificate.certificateNumber, {
    x: 1084,
    y: 816,
    size: 20,
    font: serif,
    color: emerald,
  });

  page.drawText(certificate.instructorName, {
    x: 210,
    y: 154,
    size: 21,
    font: serif,
    color: charcoal,
  });
  page.drawText("COURSE INSTRUCTOR", {
    x: 228,
    y: 108,
    size: 12,
    font: sans,
    color: charcoal,
  });

  page.drawImage(qr, {
    x: 1012,
    y: 138,
    width: 98,
    height: 98,
  });
  page.drawText("SCAN TO VERIFY", {
    x: 1142,
    y: 176,
    size: 16,
    font: sansBold,
    color: emerald,
  });
  page.drawText("This certificate can be", {
    x: 1142,
    y: 144,
    size: 12,
    font: serif,
    color: charcoal,
  });
  page.drawText("verified online", {
    x: 1142,
    y: 124,
    size: 12,
    font: serif,
    color: charcoal,
  });
  page.drawText(academy.verificationHost, {
    x: 1142,
    y: 88,
    size: 12,
    font: sans,
    color: emerald,
  });

  page.drawText("ISSUE DATE", {
    x: 488,
    y: 68,
    size: 12,
    font: sansBold,
    color: ivory,
  });
  page.drawText(formatDate(certificate.issueDate), {
    x: 488,
    y: 40,
    size: 15,
    font: serif,
    color: ivory,
  });

  page.drawText("VERIFICATION URL", {
    x: 954,
    y: 68,
    size: 12,
    font: sansBold,
    color: ivory,
  });
  page.drawText(academy.verificationHost, {
    x: 954,
    y: 40,
    size: 15,
    font: serif,
    color: ivory,
  });

  const bytes = await pdf.save();

  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${certificate.certificateNumber}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}

function centerText(
  width: number,
  font: { widthOfTextAtSize: (text: string, size: number) => number },
  size: number,
  text: string,
) {
  return width / 2 - font.widthOfTextAtSize(text, size) / 2;
}

function fitFontSize(
  text: string,
  font: { widthOfTextAtSize: (text: string, size: number) => number },
  startSize: number,
  minSize: number,
  maxWidth: number,
) {
  let size = startSize;

  while (size > minSize && font.widthOfTextAtSize(text, size) > maxWidth) {
    size -= 2;
  }

  return size;
}

function formatDate(value: string) {
  const parsed = new Date(`${value}T00:00:00Z`);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}
