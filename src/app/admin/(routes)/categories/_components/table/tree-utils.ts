  // Tree data transformation utilities
import { type Category } from "../../_types/category.types";
import { type CategoryTreeNode } from "./types";

/**
 * Converts flat category array to hierarchical tree structure
 */
export function buildCategoryTree(
  categories: Category[], 
  expandedIds: Set<string> = new Set(),
  parentId: string | null = null,
  depth: number = 0,
  parentPath: string[] = [],
  siblingContext: { index: number; total: number; parentSiblings: boolean[] } = { index: 0, total: 0, parentSiblings: [] }
): CategoryTreeNode[] {
  const filteredCategories = categories.filter(cat => cat.parent === parentId);
  
  return filteredCategories.map((category, index) => {
    const children = categories.filter(cat => cat.parent === category._id);
    const hasChildren = children.length > 0;
    // Only expand if explicitly in expandedIds set - don't auto-expand root level
    const isExpanded = expandedIds.has(category._id);
    const isLastChild = index === filteredCategories.length - 1;
    
    // Build sibling context for connecting lines
    const currentSiblingHasNext = [...siblingContext.parentSiblings];
    if (depth > 0) {
      currentSiblingHasNext[depth - 1] = !isLastChild;
    }
    
    const treeNode: CategoryTreeNode = {
      ...category,
      children: isExpanded && hasChildren 
        ? buildCategoryTree(
            categories, 
            expandedIds, 
            category._id, 
            depth + 1, 
            [...parentPath, category._id],
            { 
              index, 
              total: filteredCategories.length, 
              parentSiblings: currentSiblingHasNext 
            }
          )
        : [],
      hasChildren,
      isExpanded,
      depth,
      parentPath,
      isLastChild,
      siblingHasNext: currentSiblingHasNext,
    };
    
    return treeNode;
  });
}

/**
 * Flattens tree structure for table rendering
 */
export function flattenTree(tree: CategoryTreeNode[]): CategoryTreeNode[] {
  const result: CategoryTreeNode[] = [];
  
  function traverse(nodes: CategoryTreeNode[]) {
    nodes.forEach(node => {
      result.push(node);
      if (node.isExpanded && node.children.length > 0) {
        traverse(node.children);
      }
    });
  }
  
  traverse(tree);
  return result;
}

/**
 * Gets all descendant IDs for a given category
 */
export function getDescendantIds(
  categories: Category[], 
  parentId: string, 
  includeParent: boolean = true
): string[] {
  const result: string[] = includeParent ? [parentId] : [];
  const children = categories.filter(cat => cat.parent === parentId);
  
  children.forEach(child => {
    result.push(...getDescendantIds(categories, child._id, true));
  });
  
  return result;
}

/**
 * Gets all ancestor IDs for a given category
 */
export function getAncestorIds(
  categories: Category[], 
  categoryId: string, 
  includeCategory: boolean = false
): string[] {
  const result: string[] = includeCategory ? [categoryId] : [];
  const category = categories.find(cat => cat._id === categoryId);
  
  if (category && category.parent) {
    result.unshift(category.parent);
    result.unshift(...getAncestorIds(categories, category.parent, false));
  }
  
  return result;
}

/**
 * Checks if a category has any selected descendants
 */
export function hasSelectedDescendants(
  categories: Category[],
  parentId: string,
  selectedIds: Set<string>
): boolean {
  const descendants = getDescendantIds(categories, parentId, false);
  return descendants.some(id => selectedIds.has(id));
}

/**
 * Checks if all descendants are selected
 */
export function areAllDescendantsSelected(
  categories: Category[],
  parentId: string,
  selectedIds: Set<string>
): boolean {
  const descendants = getDescendantIds(categories, parentId, false);
  return descendants.length > 0 && descendants.every(id => selectedIds.has(id));
}

/**
 * Gets the selection state for a category (selected, indeterminate, or unselected)
 */
export function getCategorySelectionState(
  categories: Category[],
  categoryId: string,
  selectedIds: Set<string>
): 'selected' | 'indeterminate' | 'unselected' {
  if (selectedIds.has(categoryId)) {
    return 'selected';
  }
  
  if (hasSelectedDescendants(categories, categoryId, selectedIds)) {
    return 'indeterminate';
  }
  
  return 'unselected';
}

/**
 * Toggles selection for a category and all its descendants
 */
export function toggleCategorySelection(
  categories: Category[],
  categoryId: string,
  currentSelectedIds: Set<string>
): Set<string> {
  const newSelectedIds = new Set(currentSelectedIds);
  const descendants = getDescendantIds(categories, categoryId, true);
  
  const isCurrentlySelected = newSelectedIds.has(categoryId);
  
  if (isCurrentlySelected) {
    // Unselect this category and all descendants
    descendants.forEach(id => newSelectedIds.delete(id));
  } else {
    // Select this category and all descendants
    descendants.forEach(id => newSelectedIds.add(id));
  }
  
  return newSelectedIds;
}

/**
 * Auto-expands tree to a certain depth
 */
export function getAutoExpandedIds(
  categories: Category[],
  maxDepth: number = 2
): Set<string> {
  const expandedIds = new Set<string>();
  
  categories.forEach(category => {
    if (category.level < maxDepth) {
      expandedIds.add(category._id);
    }
  });
  
  return expandedIds;
}

/**
 * Get root level categories to expand by default
 */
export function getRootExpandedIds(
  categories: Category[]
): Set<string> {
  const expandedIds = new Set<string>();
  
  // Expand all root level categories (level 0)
  categories.forEach(category => {
    if (category.level === 0) {
      expandedIds.add(category._id);
    }
  });
  
  return expandedIds;
}

/**
 * Sorts tree nodes while maintaining hierarchy
 */
export function sortTreeNodes(
  tree: CategoryTreeNode[],
  sortFn: (a: CategoryTreeNode, b: CategoryTreeNode) => number
): CategoryTreeNode[] {
  const sortedTree = [...tree].sort(sortFn);
  
  return sortedTree.map(node => ({
    ...node,
    children: node.children.length > 0 
      ? sortTreeNodes(node.children, sortFn)
      : []
  }));
}

/**
 * Filters tree nodes based on search criteria
 */
export function filterTreeNodes(
  tree: CategoryTreeNode[],
  searchTerm: string,
  matchFields: (keyof Category)[] = ['name', 'slug']
): CategoryTreeNode[] {
  if (!searchTerm.trim()) return tree;
  
  const searchLower = searchTerm.toLowerCase();
  
  function nodeMatches(node: CategoryTreeNode): boolean {
    return matchFields.some(field => {
      const value = node[field];
      return typeof value === 'string' && value.toLowerCase().includes(searchLower);
    });
  }
  
  function filterRecursive(nodes: CategoryTreeNode[]): CategoryTreeNode[] {
    const result: CategoryTreeNode[] = [];
    
    nodes.forEach(node => {
      const matchesSearch = nodeMatches(node);
      const filteredChildren = filterRecursive(node.children);
      
      // Include node if it matches search or has matching children
      if (matchesSearch || filteredChildren.length > 0) {
        result.push({
          ...node,
          children: filteredChildren,
          isExpanded: filteredChildren.length > 0 ? true : node.isExpanded
        });
      }
    });
    
    return result;
  }
  
  return filterRecursive(tree);
}