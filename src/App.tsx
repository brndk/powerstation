/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform } from "motion/react";
import { 
  Battery, 
  Zap, 
  Shield, 
  Clock, 
  Cpu, 
  Plug, 
  Sun, 
  Car, 
  Usb, 
  ArrowRight, 
  CheckCircle2, 
  Menu, 
  X,
  ChevronDown,
  Power,
  Edit3,
  Save,
  Image as ImageIcon
} from "lucide-react";
import { useState, useRef, useEffect, createContext, useContext } from "react";

// --- CMS Logic ---

const DEFAULT_DATA = {
  hero: {
    badge: "Next-Gen Power Station",
    title: "FOSSiBOT F2400",
    description: "The ultimate portable power solution. 2400W AC output, 2048Wh capacity, and ultra-fast charging to keep your life running anywhere.",
    image: "https://picsum.photos/seed/powerstation/800/600",
    stats: [
      { value: "2400W", label: "AC Output" },
      { value: "2048Wh", label: "Capacity" },
      { value: "1.5H", label: "Full Charge" }
    ]
  },
  features: {
    title: "Engineered for Performance",
    subtitle: "Built with cutting-edge technology to provide reliable power in any situation.",
    items: [
      { title: "2400W AC Output", description: "Power 99% of your home appliances, from coffee makers to electric grills and even air conditioners." },
      { title: "LiFePO4 Longevity", description: "EV-grade batteries with 3500+ life cycles to 80% capacity. That's over 10 years of daily use." },
      { title: "1100W Fast Charging", description: "Charge from 0 to 100% in just 1.5 hours using standard AC wall outlet. No bulky adapters needed." },
      { title: "UPS Backup < 10ms", description: "Seamless power transition during outages. Protect your sensitive electronics and data." },
      { title: "500W Solar Input", description: "Eco-friendly charging. Fully recharge in 4-6 hours with solar panels under optimal conditions." },
      { title: "BMS Protection", description: "Advanced Battery Management System monitors voltage, current, and temperature in real-time." }
    ]
  },
  specs: {
    title: "Technical Specifications",
    image: "https://picsum.photos/seed/tech/800/800",
    items: [
      { label: "Capacity", value: "2048Wh (51.2V, 40Ah)" },
      { label: "Battery Type", value: "LiFePO4 (Lithium Iron Phosphate)" },
      { label: "Cycle Life", value: "3500+ Cycles to 80% Original Capacity" },
      { label: "AC Output", value: "2400W Total (Surge 4800W)" },
      { label: "AC Input", value: "1100W Max, 220-240V" },
      { label: "Solar Input", value: "500W Max, 12V-48V, 15A" },
      { label: "Charging Temp", value: "0°C - 40°C (32°F - 104°F)" },
      { label: "Dimensions", value: "38.6 x 28.4 x 32.1 cm" },
      { label: "Weight", value: "22 kg (48.5 lbs)" }
    ]
  },
  cta: {
    title: "Ready for Any Adventure?",
    description: "Join thousands of happy customers who trust FOSSiBOT for their off-grid and emergency power needs.",
    button: "Get Yours Today — $1,299"
  },
  testimonials: {
    title: "Trusted by Professionals",
    items: [
      { text: "\"The F2400 is a beast. I use it for my mobile workshop and it runs my table saw without breaking a sweat. The charging speed is a game changer.\"", name: "Mark R.", role: "Professional Carpenter" },
      { text: "\"Perfect for our RV trips. We can stay off-grid for days and still have all the comforts of home. The UPS feature also saved my work during a storm last week.\"", name: "Sarah L.", role: "Digital Nomad" }
    ],
    gallery: [
      "https://picsum.photos/seed/camp1/400/500",
      "https://picsum.photos/seed/camp2/400/300",
      "https://picsum.photos/seed/camp3/400/300",
      "https://picsum.photos/seed/camp4/400/500"
    ]
  }
};

const CMSContext = createContext(null);

const CMSProvider = ({ children }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("fossibot_cms_data");
    return saved ? JSON.parse(saved) : DEFAULT_DATA;
  });

  useEffect(() => {
    localStorage.setItem("fossibot_cms_data", JSON.stringify(data));
  }, [data]);

  const updateData = (path, value) => {
    setData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  return (
    <CMSContext.Provider value={{ isEditMode, setIsEditMode, data, updateData }}>
      {children}
      {/* Edit Toggle Button */}
      <button 
        onClick={() => setIsEditMode(!isEditMode)}
        className={`fixed bottom-8 right-8 z-[100] p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 active:scale-95 flex items-center space-x-2 ${isEditMode ? 'bg-green-500 text-white' : 'bg-amber-500 text-neutral-950'}`}
      >
        {isEditMode ? <Save size={24} /> : <Edit3 size={24} />}
        <span className="font-bold">{isEditMode ? "Save Changes" : "Edit Page"}</span>
      </button>
    </CMSContext.Provider>
  );
};

const useCMS = () => useContext(CMSContext);

const EditableText = ({ path, className, element: Element = "div" }) => {
  const { isEditMode, data, updateData } = useCMS();
  const keys = path.split(".");
  let value = data;
  for (const key of keys) value = value[key];

  const handleBlur = (e) => {
    updateData(path, e.target.innerText);
  };

  return (
    <Element
      className={`${className} ${isEditMode ? 'outline-dashed outline-2 outline-amber-500/50 bg-amber-500/5 cursor-text' : ''}`}
      contentEditable={isEditMode}
      suppressContentEditableWarning={true}
      onBlur={handleBlur}
    >
      {value}
    </Element>
  );
};

const EditableImage = ({ path, className, alt, referrerPolicy }) => {
  const { isEditMode, data, updateData } = useCMS();
  const keys = path.split(".");
  let value = data;
  for (const key of keys) value = value[key];

  const handleChange = () => {
    const newUrl = prompt("Enter new image URL:", value);
    if (newUrl) updateData(path, newUrl);
  };

  return (
    <div className="relative group">
      <img src={value} className={className} alt={alt} referrerPolicy={referrerPolicy} />
      {isEditMode && (
        <button 
          onClick={handleChange}
          className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-[inherit] z-20"
        >
          <div className="bg-white text-black p-2 rounded-full shadow-lg flex items-center space-x-2">
            <ImageIcon size={20} />
            <span className="text-sm font-bold">Change Image</span>
          </div>
        </button>
      )}
    </div>
  );
};

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-2xl font-black tracking-tighter text-white">
              FOSSi<span className="text-amber-500">BOT</span>
            </span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#features" className="text-neutral-300 hover:text-amber-500 px-3 py-2 text-sm font-medium transition-colors">Features</a>
              <a href="#specs" className="text-neutral-300 hover:text-amber-500 px-3 py-2 text-sm font-medium transition-colors">Specs</a>
              <a href="#ports" className="text-neutral-300 hover:text-amber-500 px-3 py-2 text-sm font-medium transition-colors">Ports</a>
              <button className="bg-amber-500 hover:bg-amber-600 text-neutral-950 px-6 py-2 rounded-full text-sm font-bold transition-all transform hover:scale-105 active:scale-95">
                Buy Now
              </button>
            </div>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-neutral-400 hover:text-white">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-neutral-900 border-b border-neutral-800 px-2 pt-2 pb-3 space-y-1 sm:px-3"
        >
          <a href="#features" className="text-neutral-300 hover:text-amber-500 block px-3 py-2 text-base font-medium">Features</a>
          <a href="#specs" className="text-neutral-300 hover:text-amber-500 block px-3 py-2 text-base font-medium">Specs</a>
          <a href="#ports" className="text-neutral-300 hover:text-amber-500 block px-3 py-2 text-base font-medium">Ports</a>
          <button className="w-full bg-amber-500 text-neutral-950 px-6 py-3 rounded-full text-base font-bold mt-4">
            Buy Now
          </button>
        </motion.div>
      )}
    </nav>
  );
};

const Hero = () => {
  const { data } = useCMS();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-neutral-950">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full mb-6">
            <Zap size={14} className="text-amber-500" />
            <EditableText path="hero.badge" className="text-xs font-bold text-amber-500 uppercase tracking-widest" element="span" />
          </div>
          <EditableText path="hero.title" className="text-6xl md:text-8xl font-black text-white leading-none mb-6 tracking-tighter" element="h1" />
          <EditableText path="hero.description" className="text-xl text-neutral-400 mb-8 max-w-lg leading-relaxed" element="p" />
          
          <div className="flex flex-wrap gap-4 mb-12">
            {data.hero.stats.map((_, i) => (
              <div key={i} className="bg-neutral-900/50 border border-neutral-800 p-4 rounded-2xl backdrop-blur-sm">
                <EditableText path={`hero.stats.${i}.value`} className="text-amber-500 font-mono text-2xl font-bold" />
                <EditableText path={`hero.stats.${i}.label`} className="text-neutral-500 text-xs uppercase tracking-wider font-bold" />
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-amber-500 hover:bg-amber-600 text-neutral-950 px-8 py-4 rounded-full text-lg font-black transition-all flex items-center justify-center space-x-2 group">
              <span>Order Now</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border border-neutral-700 hover:border-neutral-500 text-white px-8 py-4 rounded-full text-lg font-bold transition-all">
              Watch Video
            </button>
          </div>
        </motion.div>

        <motion.div
          style={{ y, opacity }}
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="relative"
        >
          <div className="relative z-10">
            <EditableImage 
              path="hero.image"
              alt="FOSSiBOT F2400" 
              className="w-full h-auto rounded-3xl shadow-2xl shadow-amber-500/10 border border-neutral-800"
              referrerPolicy="no-referrer"
            />
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-6 bg-neutral-900 border border-neutral-700 p-6 rounded-3xl shadow-xl backdrop-blur-md hidden md:block">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                  <Shield className="text-neutral-950" />
                </div>
                <div>
                  <div className="text-white font-bold">5-Year Warranty</div>
                  <div className="text-neutral-400 text-sm">Reliability guaranteed</div>
                </div>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-40 h-40 border-t-2 border-l-2 border-amber-500/30 rounded-tl-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 border-b-2 border-r-2 border-amber-500/30 rounded-br-3xl pointer-events-none" />
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-neutral-500">
        <ChevronDown size={32} />
      </div>
    </section>
  );
};

const Features = () => {
  const { data } = useCMS();
  const icons = [
    <Zap className="text-amber-500" />,
    <Battery className="text-amber-500" />,
    <Clock className="text-amber-500" />,
    <Shield className="text-amber-500" />,
    <Sun className="text-amber-500" />,
    <Cpu className="text-amber-500" />
  ];

  return (
    <section id="features" className="py-24 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <EditableText path="features.title" className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight" element="h2" />
          <EditableText path="features.subtitle" className="text-neutral-400 max-w-2xl mx-auto" element="p" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.features.items.map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-3xl bg-neutral-900/40 border border-neutral-800 hover:border-amber-500/50 transition-all group"
            >
              <div className="w-14 h-14 bg-neutral-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-500/10 transition-colors">
                {icons[index]}
              </div>
              <EditableText path={`features.items.${index}.title`} className="text-xl font-bold text-white mb-3" element="h3" />
              <EditableText path={`features.items.${index}.description`} className="text-neutral-400 leading-relaxed" element="p" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Specs = () => {
  const { data } = useCMS();

  return (
    <section id="specs" className="py-24 bg-neutral-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <EditableText path="specs.title" className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight" element="h2" />
            <div className="space-y-4">
              {data.specs.items.map((_, index) => (
                <div key={index} className="flex justify-between py-4 border-b border-neutral-800">
                  <EditableText path={`specs.items.${index}.label`} className="text-neutral-500 font-medium" element="span" />
                  <EditableText path={`specs.items.${index}.value`} className="text-white font-mono font-bold" element="span" />
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-neutral-800 rounded-3xl overflow-hidden border border-neutral-700">
              <EditableImage 
                path="specs.image"
                alt="Internal view" 
                className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                    <Cpu className="text-neutral-950" />
                  </div>
                  <h4 className="text-xl font-bold text-white">Advanced BMS</h4>
                </div>
                <p className="text-neutral-400 text-sm">
                  Equipped with high-precision sensors and intelligent algorithms to ensure safety and efficiency in every charge cycle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Ports = () => {
  const portCategories = [
    {
      title: "AC Output",
      count: "3x",
      icon: <Plug size={20} />,
      details: "2400W Total, Pure Sine Wave"
    },
    {
      title: "USB-C",
      count: "4x",
      icon: <Usb size={20} />,
      details: "1x 100W PD, 3x 20W"
    },
    {
      title: "USB-A",
      count: "2x",
      icon: <Usb size={20} />,
      details: "QC3.0 18W Max"
    },
    {
      title: "DC Output",
      count: "2x",
      icon: <Power size={20} />,
      details: "12V/3A DC5521"
    },
    {
      title: "Car Port",
      count: "1x",
      icon: <Car size={20} />,
      details: "12V/10A Cigarette Lighter"
    },
    {
      title: "XT60",
      count: "1x",
      icon: <Power size={20} />,
      details: "12V/25A High Current"
    }
  ];

  return (
    <section id="ports" className="py-24 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">13 Ports for <span className="text-amber-500">Every Device</span></h2>
          <p className="text-neutral-400">Charge everything from your laptop to your refrigerator simultaneously.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {portCategories.map((port, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl text-center"
            >
              <div className="text-amber-500 mb-4 flex justify-center">{port.icon}</div>
              <div className="text-3xl font-black text-white mb-1">{port.count}</div>
              <div className="text-sm font-bold text-neutral-300 mb-2 uppercase tracking-tight">{port.title}</div>
              <div className="text-[10px] text-neutral-500 font-mono">{port.details}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2">
            <span className="text-2xl font-black tracking-tighter text-white mb-6 block">
              FOSSi<span className="text-amber-500">BOT</span>
            </span>
            <p className="text-neutral-500 max-w-sm mb-6">
              Leading the way in portable energy solutions. We empower your adventures and protect your home with reliable, high-performance power stations.
            </p>
            <div className="flex space-x-4">
              {/* Social placeholders */}
              <div className="w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center hover:bg-amber-500 transition-colors cursor-pointer">
                <span className="text-white text-xs font-bold">FB</span>
              </div>
              <div className="w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center hover:bg-amber-500 transition-colors cursor-pointer">
                <span className="text-white text-xs font-bold">IG</span>
              </div>
              <div className="w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center hover:bg-amber-500 transition-colors cursor-pointer">
                <span className="text-white text-xs font-bold">TW</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Product</h4>
            <ul className="space-y-4 text-neutral-500 text-sm">
              <li><a href="#" className="hover:text-amber-500 transition-colors">F2400 Station</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">Solar Panels</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">Accessories</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">Refurbished</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Support</h4>
            <ul className="space-y-4 text-neutral-500 text-sm">
              <li><a href="#" className="hover:text-amber-500 transition-colors">User Manuals</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">Warranty Policy</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-12 border-t border-neutral-900 flex flex-col md:row justify-between items-center text-neutral-600 text-xs">
          <p>© 2026 FOSSiBOT. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-neutral-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-neutral-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <CMSProvider>
      <div className="min-h-screen bg-neutral-950 font-sans selection:bg-amber-500 selection:text-neutral-950">
        <Navbar />
        <main>
          <Hero />
          <Features />
          
          {/* Mid-page CTA */}
          <section className="py-20 bg-amber-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <EditableText path="cta.title" className="text-4xl md:text-6xl font-black text-neutral-950 mb-8 tracking-tight" element="h2" />
              <EditableText path="cta.description" className="text-neutral-900/80 text-xl mb-10 max-w-2xl mx-auto font-medium" element="p" />
              <button className="bg-neutral-950 text-white px-12 py-5 rounded-full text-xl font-black hover:scale-105 transition-transform shadow-2xl">
                <EditableText path="cta.button" className="inline" element="span" />
              </button>
            </div>
          </section>

          <Specs />
          <Ports />

          {/* Testimonials / Trust */}
          <section className="py-24 bg-neutral-950 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="lg:w-1/2">
                  <EditableText path="testimonials.title" className="text-4xl font-black text-white mb-6" element="h2" />
                  <div className="space-y-6">
                    {[0, 1].map(i => (
                      <div key={i} className="bg-neutral-900 p-6 rounded-3xl border border-neutral-800">
                        <EditableText path={`testimonials.items.${i}.text`} className="text-neutral-300 italic mb-4" element="p" />
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-neutral-800 rounded-full" />
                          <div>
                            <EditableText path={`testimonials.items.${i}.name`} className="text-white font-bold" />
                            <EditableText path={`testimonials.items.${i}.role`} className="text-amber-500 text-xs font-bold" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="lg:w-1/2 grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <EditableImage path="testimonials.gallery.0" alt="Camping" className="rounded-3xl w-full h-64 object-cover" referrerPolicy="no-referrer" />
                    <EditableImage path="testimonials.gallery.1" alt="RV" className="rounded-3xl w-full h-48 object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="space-y-4 pt-8">
                    <EditableImage path="testimonials.gallery.2" alt="Work" className="rounded-3xl w-full h-48 object-cover" referrerPolicy="no-referrer" />
                    <EditableImage path="testimonials.gallery.3" alt="Home" className="rounded-3xl w-full h-64 object-cover" referrerPolicy="no-referrer" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </CMSProvider>
  );
}
