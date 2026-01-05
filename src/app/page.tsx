"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { WalletCards } from 'lucide-react';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { QRCodeDisplay } from "@/components/qr-code-display";

const UPI_ID = "9363289355-2@ibl";
const PAYEE_NAME = "Sendhur Juice and Snacks";

const formSchema = z.object({
  amount: z.coerce
    .number({ invalid_type_error: "Please enter a valid number." })
    .positive({ message: "Amount must be a positive number." })
    .min(1, { message: "Amount must be at least ₹1."})
    .max(100000, { message: "Amount cannot exceed ₹1,00,000." }),
});

export default function Home() {
  const [upiUri, setUpiUri] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "" as any,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { amount } = values;
    const transactionNote = `Payment for Order`;
    const upiString = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(
      PAYEE_NAME
    )}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(
      transactionNote
    )}`;
    
    setAmount(amount);
    setUpiUri(upiString);
  }

  const handleRefresh = () => {
    setUpiUri(null);
    setAmount(null);
    form.reset();
  };
  
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 font-body">
      <header className="absolute top-0 left-0 flex w-full items-center justify-center p-6">
        <div className="flex items-center gap-3 rounded-lg bg-primary px-4 py-2 text-primary-foreground shadow-lg">
          <WalletCards className="h-7 w-7" />
          <h1 className="text-xl font-bold tracking-wide">
            QuickPay QR Generator
          </h1>
        </div>
      </header>

      <main className="w-full max-w-sm space-y-4">
        {!upiUri ? (
          <Card className="w-full max-w-sm animate-in fade-in duration-500">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Generate Payment QR</CardTitle>
              <CardDescription>
                Enter an amount to generate a UPI QR code for {PAYEE_NAME}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount (INR)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 100"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value === '' ? '' : e.target.valueAsNumber)}
                            step="0.01"
                            min="1"
                            className="text-lg"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full text-lg h-12">
                    Generate QR Code
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        ) : (
          <QRCodeDisplay 
            upiUri={upiUri} 
            amount={amount!} 
            onRefresh={handleRefresh} 
          />
        )}
      </main>
      <footer className="absolute bottom-4 text-center text-sm text-primary/80">
        <p>
          Powered by Sendhur Juice and Snacks
        </p>
      </footer>
    </div>
  );
}
