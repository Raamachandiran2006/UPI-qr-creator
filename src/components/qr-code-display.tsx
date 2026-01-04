"use client";

import { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface QRCodeDisplayProps {
  upiUri: string;
  amount: number;
  onRefresh: () => void;
}

export function QRCodeDisplay({ upiUri, amount, onRefresh }: QRCodeDisplayProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (!qrRef.current) return;

    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) return;

    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
      
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `upi-qr-payment-${amount.toFixed(2)}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <Card className="w-full max-w-sm animate-in fade-in-0 zoom-in-95 duration-500">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-2xl">Scan to Pay</CardTitle>
        <CardDescription>Use any UPI app to complete the payment.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-4">
        <div ref={qrRef} className="rounded-lg border bg-white p-4 shadow-inner">
          <QRCodeCanvas 
            value={upiUri} 
            size={256}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"L"}
            includeMargin={false}
          />
        </div>
        <p className="text-4xl font-bold tracking-tight text-primary">₹ {amount.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-4">
        <Button onClick={handleDownload} size="lg">
          <Download className="mr-2 h-5 w-5" />
          Download
        </Button>
        <Button variant="outline" onClick={onRefresh} size="lg">
          <RefreshCw className="mr-2 h-5 w-5" />
          New QR
        </Button>
      </CardFooter>
    </Card>
  );
}
