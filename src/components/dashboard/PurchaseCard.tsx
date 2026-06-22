import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

type Props = {
  title: string;
  date: string;
  onDownload?: () => void;
};

export default function PurchaseCard({
  title,
  date,
  onDownload,
}: Props) {
  return (
    <Card className="hover:scale-[1.02] duration-300">
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-white heading-font truncate">
        {title}
      </h2>

      <p className="text-zinc-550 dark:text-zinc-400 mt-2 font-semibold text-sm">
        Purchased on {date}
      </p>

      <div className="mt-6">
        <Button
          onClick={onDownload}
          className="w-full"
        >
          Download Stem File
        </Button>
      </div>
    </Card>
  );
}