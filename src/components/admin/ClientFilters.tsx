import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TECHNICIANS } from "@/data/supportData";

interface ClientFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  techFilter: string;
  onTechFilterChange: (v: string) => void;
}

export default function ClientFilters({
  search, onSearchChange,
  techFilter, onTechFilterChange,
}: ClientFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2.5 items-center">
      <div className="relative flex-1 w-full sm:min-w-[300px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por empresa ou ID..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-9 bg-muted/30 border-border text-sm"
        />
      </div>
      <Select value={techFilter} onValueChange={onTechFilterChange}>
        <SelectTrigger className="w-full sm:w-[180px] h-9 bg-muted/30 border-border text-sm">
          <SelectValue placeholder="Técnico" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os técnicos</SelectItem>
          {TECHNICIANS.map((t) => (
            <SelectItem key={t} value={t}>{t}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
