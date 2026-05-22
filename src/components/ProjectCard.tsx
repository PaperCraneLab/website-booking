interface Props {
  title: string;
  description: string;
  image: string;
  partner: string;
}

export default function ProjectCard({ title, description, image, partner }: Props) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md transition-transform hover:scale-105">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-sm text-gray-500 mb-2">In partnership with {partner}</p>
      <div className="h-60 overflow-hidden mb-4">
        <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
      </div>
      <p className="text-gray-700">{description}</p>
    </div>
  );
}
