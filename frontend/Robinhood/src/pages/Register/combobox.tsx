import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";

export function ComboBox({ title, width, value, onSelect, options = [] }) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  // Update search state and filter options dynamically
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={"w-[150px] justify-content"}
        >
          {value ? value : `Select ${title}...`}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={`w-[150px] p-0`}>
        <Command>
          <CommandInput
            placeholder={`Search ${title}...`}
            value={search}
            onInput={(e) => setSearch(e.target.value)} // Corrected input event handling
          />
          <CommandList>
            {filteredOptions.length === 0 ? (
              <CommandEmpty>No {title} found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => {
                      onSelect(option);
                      setOpen(false);
                      setSearch(""); // Reset search field after selection
                    }}
                  >
                    {option}
                    <Check className={cn("ml-auto", value === option ? "opacity-100" : "opacity-0")} />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
