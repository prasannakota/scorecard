import { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address!' }),
});

export default function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  });

  const handleSubmit = (data) => {
    console.log('Sending password reset link to:', data.email);
    axios.post(`/login-reset`, {
      email: data.email.trim()
    },{
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/json",
      }}).then((response) => {
      if(response.data.code === 200) {
        console.log(response);
        setSubmitted(true);
      }
    }).catch(error => {
      console.log(error);
    });
    setSubmitted(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md px-5  py-6 md:px-8 md:py-10 border border-gray10 md:max-w-[620px]">
          {!submitted && (
            <>
              <h1 className="text-4xl font-black text-center text-black200">Forgot Password?</h1>
              <p className="text-base text-black">
                No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.
              </p>
            </>
          )}
        <div>
          {submitted ? (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="text-green-500 text-6xl" />
              </div>
              <p className="text-black font-bold text-xl">
                We have emailed your password reset link.
              </p>
              <p className="text-sm text-gray-700 mt-2">
                If your email is registered, you will receive an email to reset your password.
              </p>
              <Button
                variant="solid"
                className="w-full bg-green-600 hover:bg-green-700 border-green-600"
                onClick={() => setSubmitted(false)}
              >
                Re-send Link
              </Button>
               <div className="mt-4">
                    <Link to="/need-help" className="text-sm text-green-600 underline">
                        Need help?
                    </Link>
                </div>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="forgotinput relative">
                      <FormLabel>Email*</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="xyz@gmail.com"
                          className="w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full custombtn">
                  Send Link
                </Button>
              </form>
            </Form>
          )}
        </div>
      </Card>
    </div>
  );
}
