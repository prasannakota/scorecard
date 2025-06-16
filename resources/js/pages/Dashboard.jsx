import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { fetchAssessment, getAssessmentStatus, fetchBusinessCategories } from "@/components/api/assessment";
import backgroundImg from "@/assets/banner/bannerBackground.jpg";
import image1 from "@/assets/business/image3.jpg";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import Overview from "@/components/dashboard/Overview";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useUser } from '@/lib/UserContext';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { FaGem } from 'react-icons/fa';

export default function Dashboard() {
  const { user, updateUser } = useUser();
  const [assessment, setAssessment] = useState(null);
  const [assessmentStatus, setAssessmentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [businessCategories, setBusinessCategories] = useState([]);
   useEffect(() => {
    }, [user]);

  useEffect(() => {
    async function fetchData() {
      try {
        const businessCategory = await fetchBusinessCategories();
        if (businessCategory?.code === 200 && businessCategory?.data) {
          setBusinessCategories(businessCategory.data);
        } else {
          setBusinessCategories([]);
        }
        const assessmentResponse = await fetchAssessment();
        if (assessmentResponse?.code === 200 && assessmentResponse?.data) {
          setAssessment(assessmentResponse.data);
        } else {
          setAssessment(null);
        }
        const statusResponse = await getAssessmentStatus();
        setAssessmentStatus(statusResponse || null);        
      } catch (err) {
        setError(true);
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  const buttonClasses ="bg-white text-black rounded-full px-8 py-4 text-lg font-semibold hover:bg-white hover:text-black";
  const linkClasses = "!text-black no-underline hover:no-underline hover:text-black";

  let actionType = "start";
  let buttonLink = "/assessment-form";
  if (assessment && assessment.organization_name.trim() != '') {
     buttonLink = `/department`;
     if (assessmentStatus) {
      const departments = assessmentStatus.departments;
      if (!departments || departments === "") {
        buttonLink = `/department`;
      } else if (departments !=  "" && assessmentStatus.total_score != 100) {
        actionType = "continue";
        buttonLink = `/assessment/start?departments=${departments}&assessment_id=${assessmentStatus.assessment_id}`;
      } else {
        actionType = "download";
        buttonLink = "/result";
      }
    }
  }
  const contentMap = {
    start: {
      heading: "Commerce Scorecard: Unlock Insight. Drive Growth",
      description:
        "The Commerce Scorecard is your personalised report card, designed to highlight strengths, reveal blind spots, and benchmark your against industry leaders. It's more than that — it's your roadmap to smarter decisions, operational maturity, and sustainable growth.",
      buttonText: "Start Assessment",
    },
    continue: {
      heading: "Commerce Scorecard: Unlock Insight. Drive Growth",
      description:
        "The Commerce Scorecard is your personalised report card, designed to highlight strengths, reveal blind spots, and benchmark your against industry leaders. It's more than that — it's your roadmap to smarter decisions, operational maturity, and sustainable growth.",
      buttonText: "Continue Assessment",
    },
    download: {
      heading: "Commerce Scorecard: Unlock Insight. Drive Growth",
      description:
        "100% complete! Now, let's turn insights into action!",
      buttonText: "View Summary",
    },
  };
  const { heading, description, buttonText } = contentMap[actionType] || contentMap["start"];

  const CustomPrevArrow = ({ onClick }) => {
    return (
      <button
        onClick={onClick}
        className="absolute z-10 top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 hover:bg-gray-900 text-white rounded-full p-2 shadow-md"
        style={{ width: "40px", height: "40px" }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    );
  };
  const CustomNextArrow = ({ onClick }) => {
    return (
      <button
        onClick={onClick}
        className="absolute z-10 top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 hover:bg-gray-900 text-white rounded-full p-2 shadow-md"
        style={{ width: "40px", height: "40px" }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    );
  };
  const filteredCards = businessCategories.filter((card) => {
    const userCategoryId = user?.business_category ? parseInt(user.business_category) : null;
    if (userCategoryId) {
      return card.id === userCategoryId;
    }
    return true;
  });
  const sliderSettings = {
    dots: false,
    infinite: filteredCards.length > 3, 
    speed: 400,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 }
      },
    ],
  };

  function ExpertForm() {
    const form = useForm({
      defaultValues: {
        name: "",
        email: "",
        company: "",
        message: "",
      },
    });
    const { handleSubmit, register, formState: { errors } } = form;

    const onSubmit = (data) => {
      console.log("Form data:", data);
    };

    return (
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="name"
              rules={{
                required: "Name is required",
              }}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Name*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage>{errors.name?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[^@]+@[^@]+\.[^@]+$/,
                  message: "Invalid email address",
                },
              }}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Email*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage>{errors.email?.message}</FormMessage>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="company"
            rules={{
              required: "Company is required",
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company*</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage>{errors.company?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            rules={{
              required: "Message is required",
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message*</FormLabel>
                <FormControl>
                  <Textarea rows={4} {...field} />
                </FormControl>
                <FormMessage>{errors.message?.message}</FormMessage>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">Submit</Button>
        </form>
      </Form>

    );
  }
  return (
    <div className="container mx-auto p-2 max-w-[1440px]">
      <div className="w-full h-64 md:h-80 lg:h-96 bg-cover bg-center rounded-xl overflow-hidden flex flex-col md:flex-row justify-between items-center text-white p-6 md:p-12 mb-8"
          style={{
            backgroundImage: `url(${backgroundImg})`,
          }}
        >
          {/* Left Side */}
          <div className="text-left max-w-2xl flex-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ maxWidth: "700px" }}>
              {heading}
            </h1>
            <p className="text-lg md:text-xl mb-6" style={{ maxWidth: "900px" }}>
              {description}
            </p>
            <div className="mt-4 flex gap-x-4">
              <Button asChild>
                <Link to={buttonLink} className={`${buttonClasses} ${linkClasses}`}> {buttonText} </Link>
              </Button>
              {assessmentStatus?.total_score === 100  &&
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="bg-transparent border border-white text-white font-bold px-6 py-2 rounded-full hover:bg-white hover:text-black transition"
                      >
                        Talk to Our Experts
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Let's Get The Conversation Satrted </DialogTitle>
                        <DialogDescription>Fill out the form, and recieve an immediate follow-up from one of our
                          expertsso we can set you on the right path.
                        </DialogDescription>
                      </DialogHeader>

                      <ExpertForm />

                      <DialogFooter className="mt-6 text-sm text-center">
                        <div className="w-full text-gray-500">
                          (877)536-7486  | info@kensium.com
                        </div>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                }
            </div>
          </div>
        {/* Right Side: Progress Circle */}
         {assessmentStatus?.total_score > 0 && (
          <div className="flex flex-col items-center justify-center bg-white p-6 rounded-xl shadow-md">
            <p className="text-xl font-semibold text-gray-800 p-2 flex items-center gap-4">
              Status :{" "}
              {assessmentStatus.total_score === 100 ? (
                <span className="bg-green-600 text-white text-base px-3 py-1.5 rounded">Completed</span>
              ) : (
                <span className="bg-green-600 text-white text-base px-3 py-1.5 rounded">In Progress</span>
              )}
              <button
                className="p-2 rounded hover:bg-gray-200"
                aria-label="More actions"
                onClick={() => {
                }}
              >
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 3a2 2 0 110-4 2 2 0 010 4zm0 3a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </p>

            <div className="w-28 h-28 mb-4">
              <CircularProgressbar
                value={assessmentStatus.total_score}
                text={`${assessmentStatus.total_score}%`}
                styles={buildStyles({
                  pathColor: '#10B981',       // Green fill
                  trailColor: '#E5E7EB',      // Grey unfilled portion
                  textColor: '#10B981',       // Green text inside
                  textSize: '16px',
                })}
              />
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mt-2">
                <FaGem
                  className={
                    assessmentStatus.total_score === 100
                      ? 'text-yellow-500'
                      : 'text-gray-500'
                  }
                />
                <span className="text-sm text-black">
                  {assessmentStatus.total_score === 100 ? 'You are a Star!' : 'Almost there!'}
                </span>
              </div>
            </div>
          </div>
        )}

      </div>

      <div className="my-8">
        <Overview />
      </div>
      
      {/* Business Category */}
      <section className="bg-[#dbeaf8] py-12 px-6">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Scorecards for Every Business strategy
        </h2>
        <Slider {...sliderSettings}>
          {businessCategories
            .filter((card) => {
              if (user?.business_category) {
                const userBusinessCategoryId = user?.business_category ? parseInt(user.business_category) : null;
                  if (userBusinessCategoryId) {
                    return card.id === userBusinessCategoryId;
                  }
                
              }
              return true;
            })
            .map((card) => (
              <div key={card.id} className="px-2">
                <div className="bg-white rounded-xl shadow-md transform transition-transform duration-300 hover:scale-105 cursor-pointer">
                  <img
                    src={card.image || image1}
                    alt={card.name}
                    className="w-full h-40 object-cover rounded-t-xl"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{card.name}</h3>
                    <p className="text-gray-700 mb-4">{card.description}</p>

                    {card.points && (
                      <ul className="list-disc pl-5 mb-4 text-gray-700">
                        {card.points.map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    )}

                    <hr className="border-gray-300 mb-4" />

                    <div className="flex items-center justify-end gap-4">
                      <Link
                        to="/"
                        className="text-sm font-medium text-gray-800 no-underline hover:underline"
                      >
                        Learn More
                      </Link>
                      <Button className="bg-green-600 hover:bg-green-700 text-white font-medium text-sm px-6 py-2 rounded-full">
                        <Link
                          to={user?.business_category ? buttonLink : `/assessment-form?business=${card.id}`}
                          className="text-white no-underline"
                        >
                           Take Assessment
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </Slider>
      </section>
      <section class="flex flex-col px-10 pt-16 pb-24 bg-neutral-100 max-md:px-5">
          <h2 class="self-start text-3xl font-black tracking-tighter leading-tight text-center text-black max-md:max-w-full">
            Adapting Products and Services for the Next Wave of Innovation
          </h2>

        <div class="mt-12 w-full max-w-[1360px] max-md:mt-10 max-md:max-w-full">
          <div class="flex flex-wrap gap-10 items-start w-full max-md:max-w-full">

            <article class="grow shrink min-w-60 w-[338px] max-md:max-w-full">
              <div class="w-full">
                <img
                  src="/images/Supply_chain.png"
                  alt="Supply chain optimization blog post"
                  class="object-contain w-full rounded-lg aspect-[1.29] max-md:mr-0 max-md:max-w-full"
                />
              </div>
              <div class="mt-5 w-full">
                  <div class="flex gap-4 items-center w-full text-sm leading-snug text-center text-white uppercase h-[27px] max-w-[423px] max-md:max-w-full">
                    <span class="gap-2.5 self-stretch px-2 py-1 my-auto text-white bg-orage100 rounded">
                        Supply Chain
                    </span>
                </div>
                  <div class="flex flex-col justify-center mt-2.5 w-full text-2xl font-black tracking-normal leading-9 text-stone-700 max-md:max-w-full">
                    <h3 class="w-full text-gary70 max-md:max-w-full">
                      Optimizing Supply Chain Efficiency for E-commerce Businesses
                    </h3>
                </div>
              </div>
            </article>
            <article class="grow shrink min-w-60 w-[338px] max-md:max-w-full">
             <div class="w-full">
                <img
                  src="/images/customer_enagagement.png"
                  alt="Customer engagement analytics blog post"
                  class="object-contain w-full rounded-lg aspect-[1.29] max-md:-mr-0.5 max-md:max-w-full"
                />
              </div>
              <div class="mt-5 w-full">
                  <div class="flex gap-4 items-center w-full text-sm leading-snug text-center text-white uppercase h-[27px] max-w-[423px] max-md:max-w-full">
                    <span class="gap-2.5 self-stretch px-2 py-1 my-auto text-white bg-orage100 rounded">
                      Customer enagagement
                    </span>
                </div>
                  <div class="flex flex-col justify-center mt-2.5 w-full text-2xl font-black tracking-normal leading-9 text-stone-700 max-md:max-w-full">
                    <h3 class="w-full text-gary70 max-md:max-w-full">
                      Leveraging Data Analytics for Improved Customer Engagement
                    </h3>
                </div>
              </div>
            </article>

            <article class="grow shrink min-h-[492px] min-w-60 w-[342px] max-md:max-w-full">
              <div class="w-full">
                <img
                  src="/images/ecommerce.png"
                  alt="Cross-border e-commerce challenges blog post"
                  class="object-contain w-full rounded-xl aspect-[1.29] max-md:-mr-0.5 max-md:max-w-full"
                />
              </div>
              <div class="mt-5 w-full">
                  <div class="flex gap-4 items-center w-full text-sm leading-snug text-center text-white uppercase h-[27px] max-w-[423px] max-md:max-w-full">
                    <span class="gap-2.5 self-stretch px-2 py-1 my-auto text-white bg-orage100 rounded">
                      Ecommerce
                    </span>
                </div>
                  <div class="flex flex-col justify-center mt-2.5 w-full text-2xl font-black tracking-normal leading-9 text-stone-700 max-md:max-w-full">
                    <h3 class="w-full text-gary70 max-md:max-w-full">
                      Navigating the Challenges of Cross-Border E-commerce
                    </h3>
                </div>
              </div>
            </article>

          </div>
        </div>
      </section>

          <section class="flex flex-col justify-center px-10 py-14 max-md:px-5">
            <div class="w-full">
                <h2 class="text-3xl font-black tracking-tighter leading-tight text-center text-black max-md:max-w-full">
                    AI in Action: Designing Smarter Futures
                </h2>
                <div class="flex flex-wrap gap-10 items-start mt-12 w-full max-md:mt-10 max-md:max-w-full">

                    <article class="grow shrink min-w-60 w-[338px] max-md:max-w-full">
                        <div class="w-full">
                            <img
                                src="/images/product_sign.png"
                                alt="Product design with generative AI - innovative design concepts and AI-powered tools"
                                class="object-contain w-full rounded-lg aspect-[1.29] max-md:mr-0 max-md:max-w-full"
                            />
                        </div>
                        <div class="mt-5 w-full">
                                 <div class="flex gap-4 items-center w-full text-sm leading-snug text-center text-white uppercase h-[27px] max-w-[423px] max-md:max-w-full">
                                    <span class="gap-2.5 self-stretch px-2 py-1 my-auto text-white bg-orage100 rounded">
                                       Product design
                                    </span>
                                </div>
                                <div class="flex flex-col justify-center mt-2.5 w-full text-2xl font-black tracking-normal leading-9 text-stone-700 max-md:max-w-full">
                                    <h3 class="w-full text-gary70 max-md:max-w-full">
                                        Reimagining Product Design with Generative AI
                                    </h3>
                                </div>
                            </div>
                    </article>

                    <article class="grow shrink min-h-[492px] min-w-60 w-[342px] max-md:max-w-full">
                       <div class="w-full">
                            <img
                               src="/images/artificial_intelligence.png"
                                alt="AI-enhanced services transitioning from reactive to predictive capabilities"
                                class="object-contain w-full rounded-xl aspect-[1.29] max-md:-mr-0.5 max-md:max-w-full"
                            />
                        </div>
                       <div class="mt-5 w-full">                             
                                 <div class="flex gap-4 items-center w-full text-sm leading-snug text-center text-white uppercase h-[27px] max-w-[423px] max-md:max-w-full">
                                    <span class="gap-2.5 self-stretch px-2 py-1 my-auto text-white bg-orage100 rounded">
                                       ARTIFICIAL INTELLIGENCE
                                    </span>
                                </div>
                                <div class="flex flex-col justify-center mt-2.5 w-full text-2xl font-black tracking-normal leading-9 text-stone-700 max-md:max-w-full">
                                   <h3 class="w-full text-gary70 max-md:max-w-full">
                                        AI-Enhanced Services: From Reactive to Predictive
                                    </h3>
                                </div>
                        </div>
                    </article>

                    <article class="grow shrink min-h-[492px] min-w-60 w-[342px] max-md:max-w-full">
                        <div class="w-full">
                            <img
                                src="/images/generative_ai.png"
                                alt="The future of embedding AI technology in everyday consumer products"
                                class="object-contain w-full rounded-xl aspect-[1.29] max-md:-mr-0.5 max-md:max-w-full"
                            />
                        </div>
                        <div class="mt-5 w-full">                               
                                <div class="flex gap-4 items-center w-full text-sm leading-snug text-center text-white uppercase h-[27px] max-w-[423px] max-md:max-w-full">
                                    <span class="gap-2.5 self-stretch px-2 py-1 my-auto text-white bg-orage100 rounded">
                                       generative ai
                                    </span>
                                </div>
                                <div class="flex flex-col justify-center mt-2.5 w-full text-2xl font-black tracking-normal leading-9 text-stone-700 max-md:max-w-full">
                                    <h3 class="w-full text-gary70 max-md:max-w-full">
                                        The Next Frontier: Embedding AI in Everyday Products
                                    </h3>
                                </div>
                            </div>
                    </article>

                </div>
            </div>
        </section>


         <section class="flex flex-col justify-center px-10 py-14 max-md:px-5">
            <div class="w-full">
                <h2 class="text-3xl font-black tracking-tighter leading-tight text-center text-black max-md:max-w-full">
                   Latest Research for Your Role
                </h2>
                <div class="flex flex-wrap gap-10 items-start mt-12 w-full max-md:mt-10 max-md:max-w-full">

                    <article class="grow shrink min-w-60 w-[338px] max-md:max-w-full">
                       <div class="w-full">
                            <img
                                src="/images/Ecommerce_1.png"
                                alt="Product design with generative AI - innovative design concepts and AI-powered tools"
                                class="object-contain w-full rounded-lg aspect-[1.29] max-md:mr-0 max-md:max-w-full"
                            />
                        </div>
                        <div class="mt-5 w-full">
                               <div class="flex gap-4 items-center w-full text-sm leading-snug text-center text-white uppercase h-[27px] max-w-[423px] max-md:max-w-full">
                                    <span class="gap-2.5 self-stretch px-2 py-1 my-auto text-white bg-orage100 rounded">
                                        Ecommerce
                                    </span>
                                </div>
                                <div class="flex flex-col justify-center mt-2.5 w-full text-2xl font-black tracking-normal leading-9 text-stone-700 max-md:max-w-full">
                                    <h3 class="w-full text-gary70 max-md:max-w-full">
                                       Magic Quadrant for Source-to-Pay Suites
                                    </h3>
                            </div>
                        </div>
                    </article>

                    <article class="grow shrink min-h-[492px] min-w-60 w-[342px] max-md:max-w-full">
                        <div class="w-full">
                            <img
                                src="/images/Ecommerce_2.png"
                                alt="AI-enhanced services transitioning from reactive to predictive capabilities"
                                class="object-contain w-full rounded-xl aspect-[1.29] max-md:-mr-0.5 max-md:max-w-full"
                            />
                        </div>
                      <div class="mt-5 w-full">
                                <div class="flex gap-4 items-center w-full text-sm leading-snug text-center text-white uppercase h-[27px] max-w-[423px] max-md:max-w-full">
                                    <span class="gap-2.5 self-stretch px-2 py-1 my-auto text-white bg-orage100 rounded">
                                        Ecommerce
                                    </span>
                                </div>
                                <div class="flex flex-col justify-center mt-2.5 w-full text-2xl font-black tracking-normal leading-9 text-stone-700 max-md:max-w-full">
                                    <h3 class="w-full text-gary70 max-md:max-w-full">
                                        How to Hire a CIO Who Fits Your Business Needs
                                    </h3>
                            </div>
                        </div>
                    </article>

                    <article class="grow shrink min-h-[492px] min-w-60 w-[342px] max-md:max-w-full">
                       <div class="w-full">
                            <img
                                src="/images/Ecommerce_3.png"
                                alt="The future of embedding AI technology in everyday consumer products"
                                class="object-contain w-full rounded-xl aspect-[1.29] max-md:-mr-0.5 max-md:max-w-full"
                            />
                        </div>
                        <div class="mt-5 w-full">
                                <div class="flex gap-4 items-center w-full text-sm leading-snug text-center text-white uppercase h-[27px] max-w-[423px] max-md:max-w-full">
                                    <span class="gap-2.5 self-stretch px-2 py-1 my-auto text-white bg-orage100 rounded">
                                        Ecommerce
                                    </span>
                                </div>
                                <div class="flex flex-col justify-center mt-2.5 w-full text-2xl font-black tracking-normal leading-9 text-stone-700 max-md:max-w-full">
                                    <h3 class="w-full text-gary70 max-md:max-w-full">
                                        How to Operate and Manage a Collaborative Support Hub
                                    </h3>
                            </div>
                        </div>
                    </article>

                </div>
            </div>
        </section>

    </div>
  );
}
