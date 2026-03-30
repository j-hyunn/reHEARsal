"use client";

import * as React from "react";
import { Check, X, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils/index";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface ComboboxOption {
  value: string;
  label: string;
}

interface MultiComboboxProps {
  options: ComboboxOption[];
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
}

export function MultiCombobox({
  options,
  value,
  onValueChange,
  placeholder = "선택하세요",
  emptyMessage = "결과가 없습니다.",
  className,
}: MultiComboboxProps) {
  const [open, setOpen] = React.useState(false);

  function toggle(optionValue: string) {
    if (value.includes(optionValue)) {
      onValueChange(value.filter((v) => v !== optionValue));
    } else {
      onValueChange([...value, optionValue]);
    }
  }

  function remove(optionValue: string, e: React.MouseEvent) {
    e.stopPropagation();
    onValueChange(value.filter((v) => v !== optionValue));
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors",
            "hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-ring",
            className
          )}
        >
          {value.length === 0 ? (
            <span className="flex-1 text-left text-muted-foreground">{placeholder}</span>
          ) : (
            <>
              {value.map((v) => {
                const label = options.find((o) => o.value === v)?.label ?? v;
                return (
                  <span
                    key={v}
                    className="inline-flex items-center gap-1 rounded-md bg-accent px-2 py-0.5 text-xs font-medium text-primary"
                  >
                    {label}
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => remove(v, e)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onValueChange(value.filter((val) => val !== v));
                        }
                      }}
                      className="ml-0.5 rounded-full opacity-60 hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </span>
                  </span>
                );
              })}
            </>
          )}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command>
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={toggle}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 text-primary",
                      value.includes(option.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
