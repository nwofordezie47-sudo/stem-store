type Props = {
  title: string;
  subtitle?: string;
};

export default function SectionTitle({
  title,
  subtitle,
}: Props) {
  return (
    <div className="mb-10">

      <h1 className="text-4xl font-bold text-green-100">
        {title}
      </h1>

      {subtitle && (
        <p className="text-green-300 mt-2">
          {subtitle}
        </p>
      )}

    </div>
  );
}