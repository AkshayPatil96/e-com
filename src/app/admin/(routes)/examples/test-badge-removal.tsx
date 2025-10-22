"use client";

import DynamicAutocomplete from "@/components/ui/dynamic-autocomplete";
import { useState } from "react";

const TestMultiSelectAutocomplete = () => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const testOptions = [
    {
      id: "1",
      label: "Option 1",
      value: "1",
      description: "First test option",
    },
    {
      id: "2", 
      label: "Option 2",
      value: "2",
      description: "Second test option",
    },
    {
      id: "3",
      label: "Option 3", 
      value: "3",
      description: "Third test option",
    },
    {
      id: "4",
      label: "Option 4",
      value: "4", 
      description: "Fourth test option",
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Multi-Select Autocomplete Test</h1>
      
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h2 className="text-sm font-semibold text-blue-800 mb-2">How to use:</h2>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Click the dropdown to see available options</li>
          <li>• Click an option to select/deselect it</li>
          <li>• Selected items appear as badges below</li>
          <li>• Use the X in the main input to clear all selections</li>
          <li>• The dropdown stays open for multiple selections</li>
        </ul>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Multi-select with badges:</label>
        <DynamicAutocomplete
          value={selectedValues}
          onValueChange={(value) => {
            console.log("Value changed:", value);
            setSelectedValues(Array.isArray(value) ? value : value ? [value] : []);
          }}
          options={testOptions}
          config={{
            multiple: true,
            showBadges: true,
            allowClear: true,
            closeOnSelect: false,
          }}
          texts={{
            placeholder: "Select multiple options...",
          }}
          onSelect={(option) => console.log("Selected:", option)}
          onDeselect={(option) => console.log("Deselected:", option)}
        />
      </div>

      <div className="mt-4 p-3 bg-muted rounded">
        <p className="text-sm font-medium mb-2">Current Selection:</p>
        <pre className="text-xs">
          {JSON.stringify(selectedValues, null, 2)}
        </pre>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Test buttons:</p>
        <button 
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
          onClick={() => setSelectedValues(["1", "2"])}
        >
          Set to Options 1 & 2
        </button>
        <button 
          className="px-3 py-1 bg-green-500 text-white rounded text-sm ml-2"
          onClick={() => setSelectedValues([])}
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default TestMultiSelectAutocomplete;