import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { BsBoxArrowInRight, BsPersonPlus, BsShieldLock } from "react-icons/bs";
import Login from './Login';
import Register from './Register';
import AdminLogin from './AdminLogin';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom"

export default function Home() {
  const [activeTab, setActiveTab] = useState("login");
  return (
    <div className="flex justify-center items-center min-h-screen bg-white ">
      <div className="w-full md:max-w-[1400px] flex flex-col md:flex-row gap-10 bg-white md:p-[32px]">

        <div className="hidden md:flex flex-col items-center text-center md:w-[50%]">
          {activeTab === "login" && (
            <section
                  className="flex overflow-hidden relative flex-col items-center px-16 py-28 rounded-xl max-w-[676px] min-h-[150px] max-md:px-5 max-md:py-24"
                  role="banner"
                  aria-labelledby="hero-title"
              >
                  <img
                        src="/images/loginscreen.png"
                        alt="loginscreen"
                      className="object-cover absolute inset-0 size-full"
                  />
                  <h1
                      id="hero-title"
                      className="relative self-stretch text-5xl font-black tracking-tighter text-center text-white leading-[58px] max-md:max-w-full max-md:text-4xl max-md:leading-[54px]"
                  >
                      Evaluate your Commerce business's performance .
                  </h1>
                  <p
                      className="relative text-2xl leading-7 text-center text-white font-[350] mt-[380px] max-md:mt-10 max-md:max-w-full"
                  >
                      Discover how your online store performs, compare with industry benchmarks,
                      and get expert recommendations to grow your business.
                  </p>
                  {/*<Link to="/register" className="mt-6 block">
                      <Button className="w-full sm:w-auto border border-white">Get Started</Button>
                    </Link> */}
              </section>  
   )}

          {activeTab === "register" && (
                      <section
                  className="flex overflow-hidden relative flex-col items-center px-16 py-28 rounded-xl max-w-[676px] min-h-[150px] max-md:px-5 max-md:py-24"
                  role="banner"
                  aria-labelledby="hero-title"
              >
                  <img
                        src="/images/registerbg.png"
                        alt="registerbg"
                      className="object-cover absolute inset-0 size-full"
                  />
                  <h1
                      id="hero-title"
                      className="relative self-stretch text-5xl font-black tracking-tighter text-center text-white leading-[58px] max-md:max-w-full max-md:text-4xl max-md:leading-[54px]"
                  >
                      Evaluate your Commerce business's performance tyrtyurtyurty.
                  </h1>
                  <p
                      className="relative text-2xl leading-7 text-center text-white font-[350] mt-[380px] max-md:mt-10 max-md:max-w-full"
                  >
                      Discover how your online store performs, compare with industry benchmarks,
                      and get expert recommendations to grow your business.
                  </p>
                  <Link to="/register" className="mt-6 block">
                      <Button className="w-full sm:w-auto">Get Started</Button>
                    </Link>
              </section> 
              )}
        </div>

        <div className='loginscreen py-[40px] px-[20px] md:w-[50%]'>
          <div className='logo mb-[30px] md:mb-[75px]'>
            <img src="/images/Kensiumlogo.svg" alt="Logo" />
          </div>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4 p-1 bg-gray50">
              <TabsTrigger value="login" className="flex items-center justify-center gap-2 px-5 py-2 rounded-md !text-base">
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="flex items-center justify-center gap-2 px-5 rounded-md py-2 !text-base">
                Create an Account
              </TabsTrigger>
               <a
                    href="/admin/login"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-base px-5 py-2 rounded-md transition-colors"
                >
                    Admin Login
                </a>

            </TabsList>


            <TabsContent value="login">
                <div  className="loginform">
                  <Login />
                </div>
            </TabsContent>

            <TabsContent value="register">
                <div  className="loginform">
                  <Register />
                  </div>
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
