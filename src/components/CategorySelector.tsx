
import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface Category {
  value: string;
  label: string;
}

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((category) => (
        <Button
          key={category.value}
          variant="outline"
          size="sm"
          className={cn(
            "border rounded-full px-4 py-1 hover:bg-brand-50",
            selectedCategory === category.value
              ? "bg-brand-50 text-brand-700 border-brand-300"
              : "bg-white text-gray-700 border-gray-200"
          )}
          onClick={() => onSelectCategory(category.value)}
        >
          {selectedCategory === category.value && (
            <Check className="mr-1 h-3 w-3" />
          )}
          {category.label}
        </Button>
      ))}
    </div>
  );
};

export default CategorySelector;
