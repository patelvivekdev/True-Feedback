'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { resendCode } from '@/actions/auth';

// Create a schema for email validation
const resendSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export default function ResendCodeForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof resendSchema>>({
    resolver: zodResolver(resendSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof resendSchema>) => {
    setIsSubmitting(true);
    try {
      // Replace this with your actual API call to resend OTP
      const response = await resendCode(data.email);

      if (response.type === 'error') {
        toast.info(response.message);
        form.reset();
        return;
      }

      toast.success('OTP sent successfully');
      router.push(`/verify/${response.username}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-800">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div className="text-center">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight lg:text-5xl">Resend OTP</h1>
          <p className="mb-4">Enter your email to receive a new verification code</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input type="email" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending OTP
                </>
              ) : (
                'Resend OTP'
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
