interface Props {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export default function SectionTitle({ title, subtitle, centered }: Props) {
  return (
    <div className={`mb-8 ${centered ? 'text-center' : ''}`}>
      <h2 className="text-3xl font-bold text-pcl-dark-gray mb-2">{title}</h2>
      {subtitle && <p className="text-gray-500 text-lg">{subtitle}</p>}
    </div>
  );
}
