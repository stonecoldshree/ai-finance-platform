
import { NextResponse } from "next/server";
import { scanReceipt } from "@/actions/transaction";
import { db } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function GET() {
    const results = {
        metrics: {},
        details: [],
        timestamp: new Date().toISOString(),
    };

    try {
        // 1. Measure OCR Processing Time & Classification
        const filePath = path.join(process.cwd(), "public", "logo1.jpeg");
        // fallback to any image if logo1 doesn't exist, but we saw it in list_dir
        if (!fs.existsSync(filePath)) {
            results.details.push("Image file logo1.jpeg not found, skipping OCR test");
        } else {
            const fileBuffer = fs.readFileSync(filePath);
            const base64Data = fileBuffer.toString("base64");

            const startOcr = performance.now();
            // Passing mimicking the structure expected by scanReceipt (fileData object)
            // scanReceipt signature: scanReceipt(fileData) where fileData has base64 and mimeType
            // wait, let's double check signature in actions/transaction.js lines 316-321
            // It uses fileData.base64 and fileData.mimeType.

            let ocrResult = null;
            try {
                ocrResult = await scanReceipt({
                    base64: base64Data,
                    mimeType: "image/jpeg"
                });
            } catch (e) {
                results.details.push(`OCR failed: ${e.message}`);
            }

            const endOcr = performance.now();
            results.metrics.ocr_processing_time_ms = (endOcr - startOcr).toFixed(2);

            if (ocrResult) {
                results.metrics.classification_result = ocrResult.category;
                results.details.push("OCR Classification successful");
            }
        }

        // 2. Measure DB / API Response Time (Proxy)
        // We will measure how long it takes to fetch a simple record from DB
        const startDb = performance.now();
        try {
            await db.user.findFirst();
        } catch (e) {
            results.details.push(`DB fetch failed: ${e.message}`);
        }
        const endDb = performance.now();
        results.metrics.avg_db_response_time_ms = (endDb - startDb).toFixed(2);

        // 3. Anomaly Detection
        // This is static analysis based on our code review
        results.metrics.anomaly_detection_status = "Rule-based (Budget Alerts)";
        results.details.push("Anomaly detection is implemented via fixed threshold rules in `checkBudgetAlerts` (80% budget usage). No ML model present.");

        return NextResponse.json(results);

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
