"use client";

import CategoryAutocompleteV2 from "@/app/admin/(routes)/categories/_components/CategoryAutocompleteV2";
import { Button } from "@/components/ui/button";
import DynamicAutocomplete from "@/components/ui/dynamic-autocomplete";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Example form schema demonstrating various autocomplete scenarios
const exampleFormSchema = z.object({
  // Single select category
  primaryCategory: z.string().optional(),
  
  // Multi-select categories
  categories: z.array(z.string()).optional(),
  
  // Required single select
  requiredCategory: z.string().min(1, "Please select a category"),
  
  // Custom options example
  tags: z.array(z.string()).optional(),
  
  // Single custom option
  priority: z.string().optional(),
});

type ExampleFormValues = z.infer<typeof exampleFormSchema>;

// Example custom options
const priorityOptions = [
  { id: "low", label: "Low Priority", value: "low", badge: "Low" },
  { id: "medium", label: "Medium Priority", value: "medium", badge: "Medium" },
  { id: "high", label: "High Priority", value: "high", badge: "High" },
  { id: "urgent", label: "Urgent", value: "urgent", badge: "Urgent", disabled: false },
];

const tagOptions = [
  { id: "react", label: "React", value: "react", description: "JavaScript library" },
  { id: "nextjs", label: "Next.js", value: "nextjs", description: "React framework" },
  { id: "typescript", label: "TypeScript", value: "typescript", description: "Type-safe JavaScript" },
  { id: "tailwind", label: "Tailwind CSS", value: "tailwind", description: "Utility-first CSS" },
  { id: "shadcn", label: "shadcn/ui", value: "shadcn", description: "UI components" },
];

const DynamicAutocompleteExample = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<ExampleFormValues>({
    resolver: zodResolver(exampleFormSchema),
    defaultValues: {
      primaryCategory: undefined,
      categories: [],
      requiredCategory: "",
      tags: [],
      priority: undefined,
    },
  });

  const onSubmit = async (values: ExampleFormValues) => {
    setIsLoading(true);
    console.log("Form values:", values);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    alert("Form submitted! Check console for values.");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dynamic Autocomplete Examples</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive examples of the DynamicAutocomplete component with form integration
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Single Category Selection */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">1. Single Category Selection</h2>
            <FormField
              control={form.control}
              name="primaryCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Category</FormLabel>
                  <FormControl>
                    <CategoryAutocompleteV2
                      value={field.value || null}
                      onValueChange={field.onChange}
                      config={{
                        allowClear: true,
                        showHierarchy: true,
                        closeOnSelect: true,
                      }}
                      texts={{
                        placeholder: "Choose primary category...",
                        searchPlaceholder: "Search categories...",
                      }}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Select the main category for this item
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          {/* Multi-Select Categories */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">2. Multi-Select Categories</h2>
            <FormField
              control={form.control}
              name="categories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categories</FormLabel>
                  <FormControl>
                    <CategoryAutocompleteV2
                      value={field.value || []}
                      onValueChange={field.onChange}
                      config={{
                        multiple: true,
                        showBadges: true,
                        allowClear: true,
                        maxSelections: 5,
                        closeOnSelect: false,
                      }}
                      texts={{
                        placeholder: "Select multiple categories...",
                        itemsSelectedText: "categories selected",
                      }}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Select up to 5 categories. Selected items appear as badges below.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          {/* Required Category */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">3. Required Category Selection</h2>
            <FormField
              control={form.control}
              name="requiredCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Required Category *</FormLabel>
                  <FormControl>
                    <CategoryAutocompleteV2
                      value={field.value || null}
                      onValueChange={(value) => field.onChange(value || "")}
                      config={{
                        allowClear: false,
                        showActiveStatus: true,
                      }}
                      texts={{
                        placeholder: "You must select a category",
                      }}
                      required
                      disabled={isLoading}
                      error={form.formState.errors.requiredCategory?.message}
                    />
                  </FormControl>
                  <FormDescription>
                    This field is required and cannot be cleared
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          {/* Custom Options - Multi-Select Tags */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">4. Custom Multi-Select (Tags)</h2>
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technology Tags</FormLabel>
                  <FormControl>
                    <DynamicAutocomplete
                      value={field.value || []}
                      onValueChange={field.onChange}
                      options={tagOptions}
                      config={{
                        multiple: true,
                        showBadges: true,
                        showDescriptions: true,
                        badgeClassName: "bg-blue-100 text-blue-800",
                        maxSelections: 3,
                      }}
                      texts={{
                        placeholder: "Select technology tags...",
                        searchPlaceholder: "Search technologies...",
                        itemsSelectedText: "tags selected",
                      }}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Select up to 3 technology tags with custom styling
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          {/* Custom Options - Single Select */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">5. Custom Single Select (Priority)</h2>
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority Level</FormLabel>
                  <FormControl>
                    <DynamicAutocomplete
                      value={field.value || null}
                      onValueChange={field.onChange}
                      options={priorityOptions}
                      config={{
                        multiple: false,
                        showBadges: true,
                        allowClear: true,
                        triggerClassName: "bg-slate-50",
                      }}
                      texts={{
                        placeholder: "Select priority...",
                        noResultsText: "No priority levels found",
                      }}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Choose the priority level for this item
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-4 pt-6">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="min-w-32"
            >
              {isLoading ? "Submitting..." : "Submit Form"}
            </Button>
            
            <Button 
              type="button" 
              variant="outline"
              onClick={() => form.reset()}
              disabled={isLoading}
            >
              Reset Form
            </Button>
            
            <Button 
              type="button" 
              variant="secondary"
              onClick={() => console.log("Current values:", form.getValues())}
              disabled={isLoading}
            >
              Log Values
            </Button>
          </div>
        </form>
      </Form>

      {/* Debug Information */}
      <div className="mt-8 p-4 bg-slate-100 rounded-lg">
        <h3 className="font-semibold mb-2">Form State (Debug)</h3>
        <pre className="text-sm overflow-auto">
          {JSON.stringify(form.watch(), null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default DynamicAutocompleteExample;