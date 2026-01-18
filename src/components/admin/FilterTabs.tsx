import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FilterTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  counts: {
    pending: number;
    active: number;
    all: number;
  };
}

export function FilterTabs({ activeTab, onTabChange, counts }: FilterTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3 max-w-md">
        <TabsTrigger value="Pending" className="data-[state=active]:bg-yellow-100">
          Pending ({counts.pending})
        </TabsTrigger>
        <TabsTrigger value="Active" className="data-[state=active]:bg-green-100">
          Active ({counts.active})
        </TabsTrigger>
        <TabsTrigger value="all">
          All ({counts.all})
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
