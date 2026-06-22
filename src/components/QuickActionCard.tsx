import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

type Props = {
  title: string;
  description: string;
  buttonLabel: string;
  onAction?: () => void;
};

export default function QuickActionCard({
  title,
  description,
  buttonLabel,
  onAction,
}: Props) {
  return (
    <Card>
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-green-300">
          Quick action
        </p>
        <h3 className="mt-3 text-xl font-semibold text-white">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
      </div>
      <div className="mt-5">
        <Button type="button" onClick={onAction}>
          {buttonLabel}
        </Button>
      </div>
    </Card>
  );
}
