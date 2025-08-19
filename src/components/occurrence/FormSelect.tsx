import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";

const TRIGGER =
  "h-11 rounded-xl bg-white border border-input-border focus:ring-2 focus:ring-primary/20 focus:border-primary";
const CONTENT = "bg-white border border-border rounded-xl shadow-md";

export function FormSelect({
  placeholder,
  value,
  onValueChange,
  disabled,
  children,
}: {
  placeholder?: string;
  value?: string;
  onValueChange?: (v: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={TRIGGER}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className={CONTENT}>{children}</SelectContent>
    </Select>
  );
}
