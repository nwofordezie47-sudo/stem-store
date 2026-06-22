import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

type Props = {
  title: string;
  date: string;
  amount: string;
  onDownload?: () => void;
};

export default function RecentPurchaseCard({
  title,
  date,
  amount,
  onDownload,
}: Props) {
  return (
    <Card className="hover:scale-[1.02] duration-300">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white heading-font truncate max-w-[180px]">
            {title}
          </h3>
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 font-semibold">
            Purchased {date}
          </p>
        </div>
        <p className="text-right text-lg font-bold text-zinc-900 dark:text-white heading-font">
          {amount}
        </p>
      </div>
      <div className="mt-6 flex justify-end">
        <Button onClick={onDownload} className="w-full">
          Download Stems
        </Button>
      </div>
    </Card>
  );
}
