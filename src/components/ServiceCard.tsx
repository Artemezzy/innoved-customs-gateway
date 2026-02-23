import { Link } from 'react-router-dom';

const serviceImages: Record<string, string> = {
  'import': '/gallery/service-import.webp',
  'export': '/gallery/service-export.webp',
  'hs-code': '/gallery/service-hs-code.webp',
  'ved-consulting': '/gallery/service-consulting.webp',
  'certification': '/gallery/service-certification.webp',
  'customs-letters': '/gallery/service-letters.webp',
  'inspection': '/gallery/service-inspection.webp',
  'translation': '/gallery/service-translation.webp',
};

interface ServiceCardProps {
  title: string;
  slug: string;
}

export function ServiceCard({ title, slug }: ServiceCardProps) {
  const image = serviceImages[slug] || '/gallery/service-import.webp';

  return (
    <Link to={`/services/${slug}`} className="block">
      <div className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer">
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-accent/30 transition-colors duration-300" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl ring-2 ring-inset ring-accent/60" />
        <div className="relative z-10 flex items-end h-full p-4">
          <h3 className="font-montserrat font-bold text-white text-sm md:text-base lg:text-lg leading-tight drop-shadow-lg">
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
}
