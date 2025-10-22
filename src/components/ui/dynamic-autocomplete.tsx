"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  type ForwardedRef,
} from "react";

// Generic interfaces for maximum flexibility
export interface AutocompleteOption {
  id: string;
  label: string;
  value: string;
  description?: string;
  level?: number;
  isActive?: boolean;
  badge?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  metadata?: Record<string, unknown>;
}

export interface AutocompleteTexts {
  placeholder?: string;
  searchPlaceholder?: string;
  noResultsText?: string;
  loadingText?: string;
  clearText?: string;
  selectAllText?: string;
  selectedText?: string;
  itemSelectedText?: string;
  itemsSelectedText?: string;
}

export interface AutocompleteConfig {
  // Behavior
  multiple?: boolean;
  allowClear?: boolean;
  closeOnSelect?: boolean;
  showHierarchy?: boolean;
  showBadges?: boolean;
  showCheckmarks?: boolean;
  showDescriptions?: boolean;
  showActiveStatus?: boolean;
  allowSelectAll?: boolean;

  // Styling
  maxHeight?: string;
  triggerClassName?: string;
  contentClassName?: string;
  optionClassName?: string;
  badgeClassName?: string;

  // Limits & Performance
  maxSelections?: number;
  searchLimit?: number;
  debounceMs?: number;
  virtualizeThreshold?: number;

  // Custom render functions (optional)
  renderOption?: (
    option: AutocompleteOption,
    isSelected: boolean,
  ) => React.ReactNode;
  renderTrigger?: (
    selectedOptions: AutocompleteOption[],
    config: AutocompleteConfig & { texts: AutocompleteTexts },
  ) => React.ReactNode;
  renderBadge?: (
    option: AutocompleteOption,
    onRemove: () => void,
  ) => React.ReactNode;
  renderEmptyState?: () => React.ReactNode;
  renderLoadingState?: () => React.ReactNode;
}

export interface DynamicAutocompleteProps {
  // Core props
  value?: string | string[] | null;
  onValueChange: (value: string | string[] | null) => void;

  // Data & fetching
  options?: AutocompleteOption[];
  isLoading?: boolean;
  onSearch?: (query: string) => void;
  fetchOption?: (id: string) => Promise<AutocompleteOption | null>;

  // Configuration
  config?: AutocompleteConfig;
  texts?: AutocompleteTexts;

  // State & validation
  disabled?: boolean;
  error?: string;
  required?: boolean;

  // Filtering & exclusion
  excludeIds?: string[];
  filterFn?: (option: AutocompleteOption, query: string) => boolean;

  // Events
  onOpen?: () => void;
  onClose?: () => void;
  onSelect?: (option: AutocompleteOption) => void;
  onDeselect?: (option: AutocompleteOption) => void;
  onClear?: () => void;

  // Styling
  className?: string;

  // Form integration
  name?: string;
  id?: string;
}

// Default configurations
const defaultTexts: Required<AutocompleteTexts> = {
  placeholder: "Select option...",
  searchPlaceholder: "Search...",
  noResultsText: "No results found.",
  loadingText: "Loading...",
  clearText: "Clear selection",
  selectAllText: "Select all",
  selectedText: "selected",
  itemSelectedText: "item selected",
  itemsSelectedText: "items selected",
};

const defaultConfig: Required<
  Omit<
    AutocompleteConfig,
    | "renderOption"
    | "renderTrigger"
    | "renderBadge"
    | "renderEmptyState"
    | "renderLoadingState"
  >
> = {
  multiple: false,
  allowClear: true,
  closeOnSelect: true,
  showHierarchy: false,
  showBadges: true,
  showCheckmarks: true,
  showDescriptions: true,
  showActiveStatus: true,
  allowSelectAll: false,
  maxHeight: "300px",
  triggerClassName: "",
  contentClassName: "",
  optionClassName: "",
  badgeClassName: "",
  maxSelections: Infinity,
  searchLimit: 100,
  debounceMs: 300,
  virtualizeThreshold: 1000,
};

export interface DynamicAutocompleteRef {
  focus: () => void;
  blur: () => void;
  clear: () => void;
  open: () => void;
  close: () => void;
}

export const DynamicAutocomplete = forwardRef<
  DynamicAutocompleteRef,
  DynamicAutocompleteProps
>(
  (
    {
      value,
      onValueChange,
      options = [],
      isLoading = false,
      onSearch,
      fetchOption,
      config = {},
      texts = {},
      disabled = false,
      error,
      required = false,
      excludeIds = [],
      filterFn,
      onOpen,
      onClose,
      onSelect,
      onDeselect,
      onClear,
      className,
      name,
      id,
    },
    ref: ForwardedRef<DynamicAutocompleteRef>,
  ) => {
    // Memoize merged configurations
    const mergedConfig = useMemo(
      () => ({ ...defaultConfig, ...config }),
      [config],
    );
    const mergedTexts = useMemo(() => ({ ...defaultTexts, ...texts }), [texts]);

    // State management
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedOptions, setSelectedOptions] = useState<
      AutocompleteOption[]
    >([]);
    const [fetchedOptions, setFetchedOptions] = useState<
      Map<string, AutocompleteOption>
    >(new Map());

    // Debounce search
    const debouncedSearch = useDebounce(search, mergedConfig.debounceMs);

    // Normalize value to array for easier handling
    const normalizedValue = useMemo(() => {
      if (value === null || value === undefined) return [];
      return Array.isArray(value) ? value : [value];
    }, [value]);

    // Filter and process options
    const filteredOptions = useMemo(() => {
      let filtered = options.filter(
        (option) => !excludeIds.includes(option.id),
      );

      if (debouncedSearch) {
        if (filterFn) {
          filtered = filtered.filter((option) =>
            filterFn(option, debouncedSearch),
          );
        } else {
          const query = debouncedSearch.toLowerCase();
          filtered = filtered.filter(
            (option) =>
              option.label.toLowerCase().includes(query) ||
              option.description?.toLowerCase().includes(query) ||
              option.value.toLowerCase().includes(query),
          );
        }
      }

      return filtered.slice(0, mergedConfig.searchLimit);
    }, [
      options,
      excludeIds,
      debouncedSearch,
      filterFn,
      mergedConfig.searchLimit,
    ]);

    // Fetch missing selected options
    useEffect(() => {
      if (!fetchOption) return;

      const fetchMissing = async () => {
        const missing = normalizedValue.filter(
          (id) =>
            !options.find((opt) => opt.id === id) && !fetchedOptions.has(id),
        );

        const newFetched = new Map(fetchedOptions);
        await Promise.all(
          missing.map(async (id) => {
            try {
              const option = await fetchOption(id);
              if (option) {
                newFetched.set(id, option);
              }
            } catch (error) {
              console.error(`Failed to fetch option ${id}:`, error);
            }
          }),
        );

        if (newFetched.size !== fetchedOptions.size) {
          setFetchedOptions(newFetched);
        }
      };

      fetchMissing();
    }, [normalizedValue, options, fetchOption, fetchedOptions]);

    // Update selected options when value changes
    useEffect(() => {
      const newSelected: AutocompleteOption[] = [];

      for (const id of normalizedValue) {
        let option = options.find((opt) => opt.id === id);

        if (!option) {
          option = fetchedOptions.get(id);
        }

        if (option) {
          newSelected.push(option);
        }
      }

      setSelectedOptions(newSelected);
    }, [normalizedValue, options, fetchedOptions]);

    // Trigger search when needed
    useEffect(() => {
      if (onSearch && (open || debouncedSearch)) {
        onSearch(debouncedSearch);
      }
    }, [debouncedSearch, onSearch, open]);

    // Handle selection
    const handleSelect = useCallback(
      (optionId: string) => {
        const option = filteredOptions.find((opt) => opt.id === optionId);
        if (!option || option.disabled) return;

        if (mergedConfig.multiple) {
          const isSelected = normalizedValue.includes(optionId);
          let newValue: string[];

          if (isSelected) {
            newValue = normalizedValue.filter((id) => id !== optionId);
            onDeselect?.(option);
          } else {
            if (normalizedValue.length >= mergedConfig.maxSelections) return;
            newValue = [...normalizedValue, optionId];
            onSelect?.(option);
          }

          onValueChange(newValue.length === 0 ? null : newValue);
        } else {
          const newValue = normalizedValue.includes(optionId) ? null : optionId;
          if (newValue) {
            onSelect?.(option);
          } else {
            onDeselect?.(option);
          }
          onValueChange(newValue);

          if (mergedConfig.closeOnSelect) {
            setOpen(false);
          }
        }

        if (!mergedConfig.multiple || mergedConfig.closeOnSelect) {
          setSearch("");
        }
      },
      [
        filteredOptions,
        normalizedValue,
        mergedConfig,
        onValueChange,
        onSelect,
        onDeselect,
      ],
    );

    // Handle clear all
    const handleClear = useCallback(
      (e?: React.MouseEvent) => {
        e?.stopPropagation();
        onValueChange(null);
        onClear?.();
      },
      [onValueChange, onClear],
    );

    // Handle open/close
    const handleOpenChange = useCallback(
      (newOpen: boolean) => {
        setOpen(newOpen);
        if (newOpen) {
          onOpen?.();
        } else {
          onClose?.();
          setSearch("");
        }
      },
      [onOpen, onClose],
    );

    // Imperative handle for ref
    useImperativeHandle(
      ref,
      () => ({
        focus: () => {
          // Focus implementation would need trigger ref
        },
        blur: () => {
          setOpen(false);
        },
        clear: handleClear,
        open: () => setOpen(true),
        close: () => setOpen(false),
      }),
      [handleClear],
    );

    // Render functions
    const renderDefaultOption = useCallback(
      (option: AutocompleteOption, isSelected: boolean) => (
        <div className="flex items-center gap-2 w-full min-w-0">
          {mergedConfig.showCheckmarks && (
            <Check
              className={cn(
                "h-4 w-4 shrink-0",
                isSelected ? "opacity-100" : "opacity-0",
              )}
            />
          )}

          {mergedConfig.showHierarchy && typeof option.level === "number" && (
            <span className="text-muted-foreground text-xs shrink-0">
              {"—".repeat(option.level)}
            </span>
          )}

          {option.icon && <span className="shrink-0">{option.icon}</span>}

          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate font-medium">{option.label}</span>
              {option.badge && mergedConfig.showBadges && (
                <Badge
                  variant="secondary"
                  className="text-xs"
                >
                  {option.badge}
                </Badge>
              )}
            </div>

            {option.description && mergedConfig.showDescriptions && (
              <span className="text-xs text-muted-foreground truncate">
                {option.description}
              </span>
            )}
          </div>

          {mergedConfig.showActiveStatus && option.isActive === false && (
            <span className="text-xs text-destructive">Inactive</span>
          )}
        </div>
      ),
      [mergedConfig],
    );

    const renderDefaultTrigger = useCallback(
      (selected: AutocompleteOption[]) => {
        if (selected.length === 0) {
          return (
            <span className="text-muted-foreground">
              {mergedTexts.placeholder}
              {required && <span className="text-destructive ml-1">*</span>}
            </span>
          );
        }

        if (mergedConfig.multiple) {
          if (selected.length === 1) {
            return <span className="truncate">{selected[0].label}</span>;
          }
          return (
            <span className="truncate">
              {selected.length} {mergedTexts.itemsSelectedText}
            </span>
          );
        }

        return <span className="truncate">{selected[0]?.label}</span>;
      },
      [mergedConfig.multiple, mergedTexts, required],
    );

    const renderDefaultBadge = useCallback(
      (option: AutocompleteOption) => (
        <Badge
          variant="secondary"
          className={cn(
            "gap-2 pl-2 pr-2 border bg-placeholder/20 rounded-md",
            mergedConfig.badgeClassName,
          )}
        >
          <span className="truncate max-w-32">{option.label}</span>
        </Badge>
      ),
      [mergedConfig.badgeClassName],
    );

    return (
      <div className={cn("space-y-2", className)}>
        {/* Hidden input for form integration */}
        {name && (
          <input
            type="hidden"
            name={name}
            value={Array.isArray(value) ? value.join(",") : value || ""}
          />
        )}

        {/* Main Select */}
        <Popover
          open={open}
          onOpenChange={handleOpenChange}
        >
          <PopoverTrigger asChild>
            <Button
              id={id}
              variant="outline"
              role="combobox"
              aria-expanded={open}
              aria-required={required}
              aria-invalid={!!error}
              className={cn(
                "w-full justify-between",
                error && "border-destructive focus-visible:ring-destructive",
                mergedConfig.triggerClassName,
              )}
              disabled={disabled}
            >
              {mergedConfig.renderTrigger
                ? mergedConfig.renderTrigger(selectedOptions, {
                    ...mergedConfig,
                    texts: mergedTexts,
                  })
                : renderDefaultTrigger(selectedOptions)}

              <div className="flex items-center gap-1 ml-2">
                {mergedConfig.allowClear &&
                  selectedOptions.length > 0 &&
                  !disabled && (
                    <X
                      className="h-4 w-4 opacity-50 hover:opacity-100 transition-opacity"
                      onClick={handleClear}
                    />
                  )}
                <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
              </div>
            </Button>
          </PopoverTrigger>

          <PopoverContent
            className={cn(
              "w-[var(--radix-popover-trigger-width)] p-0",
              mergedConfig.contentClassName,
            )}
            align="start"
          >
            <Command shouldFilter={false}>
              <CommandInput
                placeholder={mergedTexts.searchPlaceholder}
                value={search}
                onValueChange={setSearch}
                className="h-9"
              />

              <CommandList style={{ maxHeight: mergedConfig.maxHeight }}>
                {isLoading ? (
                  mergedConfig.renderLoadingState ? (
                    mergedConfig.renderLoadingState()
                  ) : (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="ml-2 text-sm text-muted-foreground">
                        {mergedTexts.loadingText}
                      </span>
                    </div>
                  )
                ) : filteredOptions.length === 0 ? (
                  mergedConfig.renderEmptyState ? (
                    mergedConfig.renderEmptyState()
                  ) : (
                    <CommandEmpty>{mergedTexts.noResultsText}</CommandEmpty>
                  )
                ) : (
                  <CommandGroup>
                    {filteredOptions.map((option) => {
                      const isSelected = normalizedValue.includes(option.id);

                      return (
                        <CommandItem
                          key={option.id}
                          value={option.id}
                          onSelect={() => handleSelect(option.id)}
                          disabled={option.disabled}
                          className={cn(
                            "flex items-center gap-2",
                            mergedConfig.optionClassName,
                          )}
                        >
                          {mergedConfig.renderOption
                            ? mergedConfig.renderOption(option, isSelected)
                            : renderDefaultOption(option, isSelected)}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Multi-select badges */}
        {mergedConfig.multiple &&
          mergedConfig.showBadges &&
          selectedOptions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedOptions.map((option) => (
                <div key={option.id}>
                  {mergedConfig.renderBadge
                    ? mergedConfig.renderBadge(option, () => {
                        // Remove functionality disabled for simplicity
                        // Users can deselect by clicking the option in dropdown
                      })
                    : renderDefaultBadge(option)}
                </div>
              ))}
            </div>
          )}

        {/* Error message */}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  },
);

DynamicAutocomplete.displayName = "DynamicAutocomplete";

export default DynamicAutocomplete;
