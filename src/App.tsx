import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import HowWeWorkPage from "./pages/HowWeWorkPage";
import ContactPage from "./pages/ContactPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import NewsPage from "./pages/NewsPage";
import NewsItemPage from "./pages/NewsItemPage";
import FAQPage from "./pages/FAQPage";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import BrokerPage from "./pages/BrokerPage";
import BrokerCityPage from "./pages/BrokerCityPage";
import CaseZapchasteyPage from "./pages/CaseZapchasteyPage";
import CaseOdejdaPage from "./pages/CaseOdejdaPage";
import CaseOborudovaniyaPage from "./pages/CaseOborudovaniyaPage";
import CaseTechnikiPage from "./pages/CaseTechnikiPage";
import SitemapPage from "./pages/SitemapPage";
import TamozhennayaOchistkaPage from "./pages/TamozhennayaOchistkaPage";
import RastamozhkaGruzovPage from "./pages/RastamozhkaGruzovPage";
import RastamozhkaTovarovPage from "./pages/RastamozhkaTovarovPage";
import ImportPage from "./pages/ImportPage";
import ExportPage from "./pages/ExportPage";
import HsCodePage from "./pages/HsCodePage";
import VedConsultingPage from "./pages/VedConsultingPage";
import CertificationPage from "./pages/CertificationPage";
import CustomsLettersPage from "./pages/CustomsLettersPage";
import InspectionPage from "./pages/InspectionPage";
import TranslationPage from "./pages/TranslationPage";
import CookiesPage from "./pages/CookiesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LanguageProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/tamozhennaya-ochistka" element={<TamozhennayaOchistkaPage />} />
              <Route path="/services/rastamozhka-gruzov" element={<RastamozhkaGruzovPage />} />
              <Route path="/services/rastamozhka-tovarov" element={<RastamozhkaTovarovPage />} />
              <Route path="/services/import" element={<ImportPage />} />
              <Route path="/services/export" element={<ExportPage />} />
              <Route path="/services/hs-code" element={<HsCodePage />} />
              <Route path="/services/ved-consulting" element={<VedConsultingPage />} />
              <Route path="/services/certification" element={<CertificationPage />} />
              <Route path="/services/customs-letters" element={<CustomsLettersPage />} />
              <Route path="/services/inspection" element={<InspectionPage />} />
              <Route path="/services/translation" element={<TranslationPage />} />
              <Route path="/services/:slug" element={<ServiceDetailPage />} />
              <Route path="/how-we-work" element={<HowWeWorkPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/tamozhennyj-broker" element={<BrokerPage />} />
              <Route path="/tamozhennyj-broker/:city" element={<BrokerCityPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              {/* News routes temporarily hidden */}
              {/* <Route path="/news" element={<NewsPage />} /> */}
              {/* <Route path="/news/:slug" element={<NewsItemPage />} /> */}
              <Route path="/rastamojka-zapchastey" element={<CaseZapchasteyPage />} />
              <Route path="/rastamojka-odejdi" element={<CaseOdejdaPage />} />
              <Route path="/rastamojka-oborudovaniya" element={<CaseOborudovaniyaPage />} />
              <Route path="/rastamojka-tehniki" element={<CaseTechnikiPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/cookies" element={<CookiesPage />} />
              
              <Route path="/map" element={<SitemapPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </LanguageProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
