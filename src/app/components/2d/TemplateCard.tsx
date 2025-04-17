import Image from 'next/image';

interface Template {
  name: string;
  type: string;
  image: string;
}

interface Props {
  template: Template;
  selected: string;
  onSelect: (type: string) => void;
}

export default function TemplateCard({ template, selected, onSelect }: Props) {
  return (
    <div
      className={`cursor-pointer p-4 border-2 rounded-lg text-center transition-all transform hover:scale-105 ${
        selected === template.type ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
      onClick={() => onSelect(template.type)}
    >
      <Image
        src={template.image}
        alt={template.name}
        width={180}
        height={250}
        className="mx-auto mb-2"
      />
      <p className="text-sm">{template.name}</p>
    </div>
  );
}
