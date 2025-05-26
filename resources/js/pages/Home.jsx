import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { BsBoxArrowInRight, BsPersonPlus, BsShieldLock } from "react-icons/bs";
import Login from './Login';
import Register from './Register';
import AdminLogin from './AdminLogin';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom"

export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-6 rounded-2xl shadow-xl">
        <div className="flex flex-col justify-center items-center text-center p-4">
          <div className="bg-gray-900 p-4 rounded-xl mb-4">
            <img
              src="https://cdn.prod.website-files.com/664c3c71d7e537047464d70b/664eb3db1955b085f0f26768_Kensium%20Solutions%20Horizontal%20%20logo-blue%201.avif"
              alt="Logo"
              className="w-32 h-32 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to E-commerce Scorecard</h1>
          <p className="text-lg mb-3">
            Evaluate your Commerce business's performance.
          </p>
          <p className="text-muted-foreground">
            Discover how your online store performs, compare with industry benchmarks, and get expert recommendations to grow your business.
          </p>
          <Link to="/register" className="mt-6 block">
            <Button className="w-full sm:w-auto">Get Started</Button>
          </Link>
        </div>
        <div>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="login" className="flex items-center justify-center gap-2">
                <BsBoxArrowInRight className="text-lg" />
                Login
              </TabsTrigger>

              <TabsTrigger value="register" className="flex items-center justify-center gap-2">
                <BsPersonPlus className="text-lg" />
                Create an Account
              </TabsTrigger>
                <a
                    href="/admin/login"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-sm font-medium px-3 py-2 rounded-md bg-muted hover:bg-muted/80 transition-colors"
                >
                    <BsShieldLock className="text-lg" />
                    Admin Login
                </a>

            </TabsList>


            <TabsContent value="login">
              <Card>
                <CardContent className="p-4">
                  <Login />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardContent className="p-4">
                  <Register />
                </CardContent>
              </Card>
            </TabsContent>

            {/*<TabsContent value="admin">*/}
              {/*<Card>*/}
                {/*<CardContent className="p-4">*/}
                  {/*<AdminLogin />*/}
                {/*</CardContent>*/}
              {/*</Card>*/}
            {/*</TabsContent>*/}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
