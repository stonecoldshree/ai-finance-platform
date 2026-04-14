"use client";

import { useRef, useEffect } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import { scanReceipt } from "@/actions/transaction";
import { useLanguage } from "@/components/language-provider";

export function ReceiptScanner({ onScanComplete }) {
  const { t } = useLanguage();
  const fileInputRef = useRef(null);
  const MAX_RECEIPT_MB = 3;

  const {
    loading: scanReceiptLoading,
    fn: scanReceiptFn,
    data: scannedData
  } = useFetch(scanReceipt);

  const handleReceiptScan = async (file) => {
    if (file.size > MAX_RECEIPT_MB * 1024 * 1024) {
      toast.error(
        t(
          "transaction.fileSizeLimit",
          { maxSizeMB: MAX_RECEIPT_MB },
          `File size should be less than ${MAX_RECEIPT_MB}MB`
        )
      );
      return;
    }

    const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf"];


    if (!allowedTypes.includes(file.type)) {
      toast.error(t("transaction.fileTypeError"));
      return;
    }



    const reader = new FileReader();
    reader.onloadend = async () => {
      if (typeof reader.result !== "string") {
        toast.error(t("transaction.scanFailed", {}, "Could not read the selected file. Please try again."));
        return;
      }

      const base64String = reader.result.split(",")[1];
      if (!base64String) {
        toast.error(t("transaction.scanFailed", {}, "Could not read the selected file. Please try again."));
        return;
      }

      await scanReceiptFn({ base64: base64String, mimeType: file.type });
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (scannedData && !scanReceiptLoading) {
      onScanComplete(scannedData);
      toast.success(t("transaction.scanSuccess"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanReceiptLoading, scannedData]);

  return (
    <div className="flex items-center gap-4">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*,.pdf,application/pdf"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleReceiptScan(file);
          }
          e.target.value = "";
        }} />
      
      <Button
        type="button"
        variant="outline"
        className="w-full h-10 bg-gradient-to-br from-orange-500 to-orange-600 hover:opacity-90 transition-opacity text-white hover:text-white"
        onClick={() => fileInputRef.current?.click()}
        disabled={scanReceiptLoading}>
        
        {scanReceiptLoading ?
        <>
            <Loader2 className="mr-2 animate-spin" />
            <span>{t("transaction.scanning")}</span>
          </> :

        <>
            <Camera className="mr-2" />
            <span>{t("transaction.scanButton")}</span>
          </>
        }
      </Button>
    </div>);

}
