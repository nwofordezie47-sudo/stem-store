import Card from "@/components/ui/Card";

type Props = {
  title: string;
  value: string;
  description?: string;
};

export default function DashboardCard({ title, value, description }: Props) {
  return (
    <Card className="hover:scale-[1.03] transition duration-300">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-green-600 dark:text-green-400">
        {title}
      </p>
      <p className="mt-3 text-4xl font-normal text-zinc-900 dark:text-white heading-font">
        {value}
      </p>
      {description && (
        <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-500 font-semibold">
          {description}
        </p>
      )}
    </Card>
  );
}
