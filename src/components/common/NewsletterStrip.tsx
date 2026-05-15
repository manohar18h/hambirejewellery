import { Phone, Mail, ArrowRight } from "lucide-react";

const NewsletterStrip = () => {
  return (
    <div className="bg-[#fdf0e8]">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-8 px-8 py-10 lg:grid-cols-3">
        <div>
          <h3 className="text-[22px] font-medium text-[#1c1c1c]">
            Join Our Newsletter Now!
          </h3>
          <p className="mt-2 text-[16px] text-[#1c1c1c]">
            Be the first to know about new designs, events, and more!
          </p>
        </div>

        <div>
          <div className="flex overflow-hidden rounded-md border border-[#efb78f] bg-white">
            <input
              type="text"
              placeholder="Enter Your Email"
              className="w-full px-4 py-4 text-[16px] outline-none"
            />
            <button className="px-5 text-[#d83b5b] hover:bg-[#fff7f1]">
              <ArrowRight className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-start gap-3">
            <Phone className="mt-1 h-6 w-6 text-[#d83b5b]" />
            <div>
              <div className="text-[16px] font-medium text-[#1c1c1c]">
                Call Us
              </div>
              <div className="text-[16px] text-[#1c1c1c]">+91 80 25127900</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="mt-1 h-6 w-6 text-[#d83b5b]" />
            <div>
              <div className="text-[16px] font-medium text-[#1c1c1c]">
                Email Us
              </div>
              <div className="text-[16px] text-[#1c1c1c]">care@hambire.com</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterStrip;
