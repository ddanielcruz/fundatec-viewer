import * as React from 'react';
import Autosuggest from 'react-autosuggest';

import { cn } from '@/lib/tailwind';

export type AutocompleteProps<T> = {
  value: T | null;
  onChange: (value: T | null) => void;
  options: T[];
  displayValue: (item: T | null) => string;
  placeholder?: string;
  onSearch?: (value: string) => void;
  className?: string;
};

export function Autocomplete<T>({
  value,
  onChange,
  options,
  displayValue,
  placeholder,
  onSearch,
  className,
}: AutocompleteProps<T>) {
  const [inputValue, setInputValue] = React.useState(displayValue(value));
  const [suggestions, setSuggestions] = React.useState<T[]>([]);

  // Update input value when value prop changes
  React.useEffect(() => {
    setInputValue(displayValue(value));
  }, [value, displayValue]);

  const getSuggestions = (input: string) => {
    const inputValue = input.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
      ? []
      : options.filter((option) => displayValue(option).toLowerCase().includes(inputValue));
  };

  const onSuggestionsFetchRequested = ({ value }: { value: string }) => {
    setSuggestions(getSuggestions(value));
    onSearch?.(value);
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onSuggestionSelected = (_event: React.FormEvent, { suggestion }: { suggestion: T }) => {
    onChange(suggestion);
  };

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      onSuggestionSelected={onSuggestionSelected}
      getSuggestionValue={displayValue}
      renderSuggestion={(suggestion) => (
        <div className="px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground">
          {displayValue(suggestion)}
        </div>
      )}
      inputProps={{
        value: inputValue,
        onChange: (_event, { newValue }) => {
          setInputValue(newValue);
          if (newValue === '') {
            onChange(null);
          }
        },
        placeholder,
        className: cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        ),
      }}
      theme={{
        container: 'relative',
        containerOpen: 'z-50',
        suggestionsContainer: 'absolute w-full',
        suggestionsContainerOpen:
          'mt-2 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95',
        suggestionsList: 'max-h-[200px] overflow-auto p-1',
        suggestion: 'cursor-pointer rounded-sm',
        suggestionHighlighted: 'bg-accent text-accent-foreground',
      }}
    />
  );
}
