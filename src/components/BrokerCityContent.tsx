import { Link } from 'react-router-dom';
import { CheckCircle, Ship, Globe, Briefcase, ArrowRight } from 'lucide-react';

interface CityContentData {
  intro: { title: string; text: string };
  logistics: { title: string; text: string };
  services: { title: string; items: string[] };
  remote: { title: string; text: string };
  cases: { title: string; items: string[] };
  steps: { title: string; items: string[] };
  important: { title: string; items: string[] };
  cta: { title: string; text: string; button: string };
}

export function BrokerCityContent({ data }: { data: CityContentData }) {
  return (
    <div className="space-y-0">
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-foreground mb-4">
            {data.intro.title}
          </h2>
          <p className="text-muted-foreground leading-relaxed">{data.intro.text}</p>
        </div>
      </section>

      {/* Logistics */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-start gap-4 mb-4">
            <Ship className="w-8 h-8 text-primary shrink-0 mt-1" />
            <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-foreground">
              {data.logistics.title}
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed ml-12">{data.logistics.text}</p>
        </div>
      </section>

      {/* Services */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-foreground mb-8 text-center">
            {data.services.title}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {data.services.items.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors"
              >
                <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Remote Work */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-start gap-4 mb-4">
            <Globe className="w-8 h-8 text-primary shrink-0 mt-1" />
            <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-foreground">
              {data.remote.title}
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed ml-12">{data.remote.text}</p>
        </div>
      </section>

      {/* Cases */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-start gap-4 mb-8">
            <Briefcase className="w-8 h-8 text-primary shrink-0 mt-1" />
            <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-foreground">
              {data.cases.title}
            </h2>
          </div>
          <div className="space-y-4 ml-0 md:ml-12">
            {data.cases.items.map((item, i) => (
              <div
                key={i}
                className="p-5 rounded-xl border border-border bg-card"
              >
                <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-foreground mb-8 text-center">
            {data.steps.title}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {data.steps.items.map((item, i) => (
              <div
                key={i}
                className="relative p-5 rounded-xl border border-border bg-card"
              >
                <span className="absolute -top-3 -left-1 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </span>
                <p className="text-sm text-muted-foreground leading-relaxed mt-2">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-foreground mb-8 text-center">
            {data.important.title}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {data.important.items.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card"
              >
                <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-primary/5">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-foreground mb-4">
            {data.cta.title}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">{data.cta.text}</p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            {data.cta.button}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
