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
    axios.post(`/api/login-reset`, {
      email: data.email.trim()
    },{
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/json",
      }, withCredentials: true,}).then((response) => {
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
    <div className="flex items-center justify-center bg-white p-4">
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
              <div className="flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="69" height="70" viewBox="0 0 69 70" fill="none">
                <path d="M34.5 70C15.4759 70 0 54.2998 0 35C0 15.7002 15.4759 0 34.5 0C53.5241 0 69 15.7002 69 35C69 54.2998 53.5241 70 34.5 70ZM34.5 4.66667C18.0151 4.66667 4.6 18.2762 4.6 35C4.6 51.7238 18.0151 65.3333 34.5 65.3333C50.9849 65.3333 64.4 51.7238 64.4 35C64.4 18.2762 50.9849 4.66667 34.5 4.66667ZM31.5272 45.9842L52.2272 24.9842C53.1271 24.0713 53.1271 22.5984 52.2272 21.6854C51.3273 20.7725 49.8755 20.7725 48.9756 21.6854L29.9029 41.0346L22.3302 33.3521C21.4303 32.4392 19.9784 32.4392 19.0785 33.3521C18.1786 34.2651 18.1786 35.7379 19.0785 36.6509L28.2785 45.9842C28.727 46.4392 29.3164 46.6667 29.9057 46.6667C30.4951 46.6667 31.0845 46.4392 31.533 45.9842H31.5272Z" fill="#22B72C"/>
              </svg>
              </div>
              <h1 className="text-black font-bold text-4xl mt-5 mb-5 md:mt-6 md:mb-6">
                We have emailed your password reset link.
              </h1>
              <p className="text-base text-black mb-6">
                If your email is registered, you will receive an email to reset your password.
              </p>
              <Button
                variant="solid"
                className="w-full custombtn bg-primary-500"
                onClick={() => setSubmitted(false)}
              >
                Re-send Link
              </Button>
               <div className="mt-4">
                    <Link to="/need-help" className="text-base text-green200 underline font-black hover:no-underline">
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
