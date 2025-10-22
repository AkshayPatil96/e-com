# GitHub Copilot Instructions for Complete E-Commerce Platform

## 🏗️ Project Overview

This is a **Next.js 14+ Complete E-Commerce Platform** consisting of three interconnected applications:

1. **🛍️ E-Commerce Store** - Public-facing shopping experience with product browsing, cart, checkout, and user accounts
2. **👨‍💼 Seller Dashboard** - Seller management interface for inventory, orders, analytics, and store management
3. **⚙️ Admin Panel** - Administrative interface for platform management, user oversight, and system configuration

All three applications share a unified codebase with feature-rich architecture supporting multi-tenant role-based access control, real-time inventory management, and comprehensive e-commerce functionality.

## 🛠️ Technology Stack

### Core Framework
- **Next.js 14+** with App Router
- **TypeScript** with strict configuration
- **React 18** with Server Components

### UI & Styling
- **shadcn/ui** components with Radix UI primitives
- **Tailwind CSS** with custom CSS variables
- **Lucide React** for icons
- **Sonner** for toast notifications

### State Management
- **RTK Query** for server state management
- **Redux Toolkit** for global state
- **react-hook-form** with **Zod** validation
- **React hooks** for local component state

### Authentication & Security
- **JWT tokens** with refresh mechanism
- **Role-based access control** with granular permissions
- **Custom usePermissions hook**
- **Credentials: "include"** for all API requests

### File Management
- **AWS S3** integration with presigned URLs
- **Multi-format image processing**
- **Upload progress tracking**

## 📁 Project Structure & Conventions

### Folder Architecture
```
src/
├── app/                    # Next.js App Router
│   ├── (main)/             # Public E-Commerce Store
│   │   ├── (routes)/
│   │   │   ├── products/   # Product catalog and details
│   │   │   ├── category/   # Category browsing
│   │   │   ├── cart/       # Shopping cart
│   │   │   ├── checkout/   # Checkout process
│   │   │   ├── account/    # User account management
│   │   │   └── orders/     # Order history
│   │   └── layout.tsx      # Public layout
│   ├── seller/             # Seller Dashboard
│   │   ├── (routes)/
│   │   │   ├── dashboard/  # Seller analytics
│   │   │   ├── products/   # Inventory management
│   │   │   ├── orders/     # Order management
│   │   │   ├── analytics/  # Sales analytics
│   │   │   ├── settings/   # Store settings
│   │   │   └── profile/    # Seller profile
│   │   └── layout.tsx      # Seller layout
│   ├── admin/              # Admin Panel
│   │   ├── (routes)/
│   │   │   ├── dashboard/  # Admin overview
│   │   │   ├── users/      # User management
│   │   │   ├── sellers/    # Seller management
│   │   │   ├── products/   # Product oversight
│   │   │   ├── orders/     # Order management
│   │   │   ├── categories/ # Category management
│   │   │   ├── brands/     # Brand management
│   │   │   ├── analytics/  # Platform analytics
│   │   │   └── settings/   # System settings
│   │   └── layout.tsx      # Admin layout
│   ├── auth/               # Authentication pages
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── verify-email/
│   ├── api/                # API routes (if needed)
│   ├── globals.css
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page
├── components/
│   ├── ui/                 # Reusable UI components (shadcn/ui)
│   ├── store/              # Store-specific components
│   │   ├── header/         # Store header/navigation
│   │   ├── footer/         # Store footer
│   │   ├── product/        # Product components
│   │   ├── cart/           # Cart components
│   │   └── checkout/       # Checkout components
│   ├── seller/             # Seller dashboard components
│   │   ├── sidebar/        # Seller navigation
│   │   ├── analytics/      # Analytics widgets
│   │   └── inventory/      # Inventory components
│   ├── admin/              # Admin panel components
│   │   ├── sidebar/        # Admin navigation
│   │   ├── dashboard/      # Dashboard widgets
│   │   └── management/     # Management components
│   └── shared/             # Cross-platform components
│       ├── auth/           # Authentication components
│       ├── forms/          # Common form components
│       └── layout/         # Layout components
├── hooks/                  # Custom hooks
│   ├── store/              # Store-specific hooks
│   ├── seller/             # Seller-specific hooks
│   ├── admin/              # Admin-specific hooks
│   └── shared/             # Cross-platform hooks
├── redux/                  # State management
│   ├── api/                # API slice definitions
│   ├── store/              # Store-related slices
│   ├── seller/             # Seller-related slices
│   ├── admin/              # Admin-related slices
│   ├── auth/               # Authentication slices
│   └── store.ts            # Store configuration
├── lib/                    # Utilities and helpers
│   ├── validations/        # Zod schemas
│   ├── constants/          # App constants
│   ├── utils/              # Utility functions
│   └── types/              # Global types
└── styles/                 # Global styles
```

### Naming Conventions
- **PascalCase**: Components (`AdminFormModal`, `BrandTable`)
- **camelCase**: Functions, variables, hooks (`usePermissions`, `handleSubmit`)
- **kebab-case**: File names (`admin-form-modal.tsx`, `brand-table.tsx`)
- **Route grouping**: Use parentheses `(routes)`, `(main)`

### Component Organization Rules
- **Global components**: `src/components/ui/` for reusable across entire platform
- **Platform-specific**: `src/components/store/`, `src/components/seller/`, `src/components/admin/`
- **Cross-platform**: `src/components/shared/` for components used across multiple platforms
- **Route-specific**: `_components/` within route folders for route-specific usage
- **Page-specific**: `_components/` within page folders for single-page usage

### Platform-Specific Guidelines

#### 🛍️ **E-Commerce Store (Public)**
- **Responsive Design**: Mobile-first approach with full responsive support
- **Performance**: Optimize for Core Web Vitals and SEO
- **User Experience**: Focus on conversion optimization and accessibility
- **Authentication**: Optional for browsing, required for checkout
- **State Management**: Cart state, user preferences, product filters

#### 👨‍💼 **Seller Dashboard**
- **Responsive Design**: Desktop-first (1024px+) with tablet support
- **Performance**: Real-time data updates and dashboard analytics
- **User Experience**: Data-heavy interfaces with efficient workflows
- **Authentication**: Required with seller role verification
- **State Management**: Inventory, orders, analytics, store settings

#### ⚙️ **Admin Panel**
- **Responsive Design**: Desktop-only (1024px+) for complex data management
- **Performance**: Efficient data tables and bulk operations
- **User Experience**: Power-user interfaces with advanced features
- **Authentication**: Required with admin role and granular permissions
- **State Management**: Platform-wide data, user management, system settings

## 🎯 Development Guidelines

### When to Use External Libraries
**✅ PREFER EXTERNAL LIBRARIES FOR:**
- UI components (shadcn/ui, Radix UI)
- Form handling (react-hook-form)
- Date manipulation (date-fns)
- Validation schemas (Zod)
- State management (RTK Query, Redux Toolkit)
- Complex utilities (lodash for debounce/throttle)
- Security-related functions (crypto libraries)

**✅ USE CUSTOM IMPLEMENTATIONS FOR:**
- Business logic and domain-specific functions
- Permission handling (`usePermissions` hook)
- Layout utilities (`adminHeadersHeight`)
- API slice extensions
- Simple utility functions (<20 lines)
- Project-specific hooks and helpers

### TypeScript Standards
```typescript
// Always define proper interfaces
interface IUserFormData {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

// Use proper generic typing
const useApiMutation = <TData, TVariables>() => {
  // Implementation
}

// Strict null checks
const user: IUser | null = getUser();
if (!user) return null;
```

### Form Implementation Pattern
```typescript
// Always use this pattern for forms
const formSchema = z.object({
  // Zod validation schema
});

type FormValues = z.infer<typeof formSchema>;

const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    // Default values
  },
});

const handleSubmit = async (values: FormValues) => {
  try {
    await apiMutation(values).unwrap();
    toast.success("Success message");
  } catch (error) {
    toast.error("Error message");
  }
};
```

### API Integration Pattern
```typescript
// RTK Query API slice pattern
export const featureApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getItems: builder.query<IItemResponse, IItemQueryParams>({
      query: (params) => ({
        url: '/api/items',
        params,
        credentials: 'include',
      }),
      providesTags: ['Item'],
    }),
    createItem: builder.mutation<IItemResponse, ICreateItemRequest>({
      query: (data) => ({
        url: '/api/items',
        method: 'POST',
        body: data,
        credentials: 'include',
      }),
      invalidatesTags: ['Item'],
    }),
  }),
});
```

## 🔒 Security Requirements

### Authentication Patterns
- Always include `credentials: "include"` in API requests
- Use `usePermissions` hook for route/feature access control
- Implement JWT token refresh mechanism
- Validate user sessions on sensitive operations

### Input Validation
- **Client-side**: Zod schemas for all forms
- **API validation**: Match client schemas with backend validation
- **XSS Prevention**: Sanitize user inputs when rendering
- **CSRF Protection**: Include CSRF tokens where required

### Authentication & Authorization by Platform

#### 🛍️ **E-Commerce Store Authentication**
```typescript
// Optional authentication for public store
const StoreAuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  // Allow access to all, but show different UI for authenticated users
  return <>{children}</>;
};

// Required authentication for user account pages
const AccountGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/auth/login" />;
  
  return <>{children}</>;
};
```

#### 👨‍💼 **Seller Dashboard Authentication**
```typescript
// Required seller authentication
const SellerGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/auth/login" />;
  if (user.role !== 'seller') return <AccessDenied />;
  
  return <>{children}</>;
};
```

#### ⚙️ **Admin Panel Authentication**
```typescript
// Required admin authentication with permissions
const AdminGuard = ({ children, permission }: { 
  children: React.ReactNode; 
  permission?: string; 
}) => {
  const { user, isLoading } = useAuth();
  const { hasPermission } = usePermissions();
  
  if (isLoading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/auth/login" />;
  if (!['admin', 'superadmin'].includes(user.role)) return <AccessDenied />;
  if (permission && !hasPermission(permission)) return <AccessDenied />;
  
  return <>{children}</>;
};
```

## 🎨 UI/UX Standards

### UI/UX Standards by Platform

#### 🛍️ **E-Commerce Store Standards**
- **Mobile-First Design**: Fully responsive with touch-friendly interfaces
- **Performance**: Fast loading, image optimization, lazy loading
- **Conversion Focus**: Clear CTAs, streamlined checkout, trust signals
- **Accessibility**: WCAG 2.1 AA compliance for broader audience reach
- **SEO Optimization**: Semantic HTML, meta tags, structured data

```tsx
// Store component pattern
const ProductCard = ({ product }: { product: IProduct }) => {
  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <div className="aspect-square overflow-hidden">
        <Image 
          src={product.image} 
          alt={product.name}
          className="group-hover:scale-105 transition-transform"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold truncate">{product.name}</h3>
        <p className="text-lg font-bold">${product.price}</p>
        <Button className="w-full mt-2">Add to Cart</Button>
      </CardContent>
    </Card>
  );
};
```

#### 👨‍💼 **Seller Dashboard Standards**
- **Desktop-First Design**: Optimized for 1024px+ with tablet fallback
- **Data Visualization**: Charts, metrics, and analytics-focused UI
- **Workflow Efficiency**: Bulk operations, keyboard shortcuts, quick actions
- **Real-time Updates**: Live data, notifications, status indicators

```tsx
// Seller dashboard pattern
const SellerOrdersTable = () => {
  const { data: orders, isLoading } = useGetSellerOrdersQuery();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Recent Orders
          <Badge variant="secondary">{orders?.length || 0} orders</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable 
          data={orders || []}
          columns={sellerOrderColumns}
          searchPlaceholder="Search orders..."
          pagination
        />
      </CardContent>
    </Card>
  );
};
```

#### ⚙️ **Admin Panel Standards**
- **Desktop-Only Design**: Complex data management interfaces (1024px+)
- **Power User Features**: Advanced filters, bulk operations, detailed views
- **Permission-Based UI**: Conditional rendering based on admin permissions
- **System Monitoring**: Health indicators, logs, performance metrics

```tsx
// Admin panel pattern
const AdminUserManagement = () => {
  const { hasPermission } = usePermissions();
  const { data: users, isLoading } = useGetUsersQuery();
  
  if (!hasPermission('users.read')) {
    return <AccessDenied />;
  }
  
  return (
    <AdminPageLayout title="User Management">
      <div className="space-y-6">
        <UserFilters />
        <UsersTable data={users} />
        {hasPermission('users.create') && (
          <CreateUserModal />
        )}
      </div>
    </AdminPageLayout>
  );
};
```

### Form Components
```tsx
// Standard form field pattern
<FormField
  control={form.control}
  name="fieldName"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Field Label</FormLabel>
      <FormControl>
        <Input placeholder="Enter value" {...field} />
      </FormControl>
      <FormDescription>
        Helper text for the field
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Layout Patterns
- Use `AdminPageLayout` for admin pages
- Implement consistent header heights with `adminHeadersHeight`
- Follow established spacing and typography scales
- Use proper loading states and error boundaries

## ⚡ Performance Guidelines

### React Optimization
```typescript
// Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return heavyComputation(data);
}, [data]);

// Debounce search inputs
const debouncedSearch = useDebounce(searchTerm, 300);

// Lazy load components
const LazyComponent = lazy(() => import('./LazyComponent'));
```

### API Optimization
- Use RTK Query caching strategies
- Implement proper pagination
- Debounce search and filter operations
- Use React.memo for expensive list items

## 🧪 Error Handling Standards

### Try-Catch Pattern
```typescript
const handleAsyncOperation = async () => {
  try {
    const result = await apiCall();
    toast.success("Operation successful");
    return result;
  } catch (error) {
    console.error("Operation failed:", error);
    toast.error("Operation failed. Please try again.");
    throw error;
  }
};
```

### RTK Query Error Handling
```typescript
const [createUser, { isLoading, error }] = useCreateUserMutation();

// Handle errors in component
useEffect(() => {
  if (error) {
    if ('data' in error) {
      toast.error(error.data.message || "An error occurred");
    } else {
      toast.error("Network error. Please check your connection.");
    }
  }
}, [error]);
```

## 🚀 Feature Development Process

### 1. Planning Phase
- Define TypeScript interfaces in `_types/` folder
- Create Zod validation schemas
- Plan component hierarchy and data flow

### 2. Implementation Phase
- Create API slice with proper typing
- Implement components following established patterns
- Add proper error handling and loading states
- Include permission checks where needed

### 3. Testing Phase
- Test with different user roles
- Verify responsive design
- Check accessibility compliance
- Test error scenarios

### 4. Integration Phase
- Ensure proper navigation and routing
- Test with existing features
- Verify performance impact
- Document any new patterns or utilities

## 🔧 Code Quality Rules

### ESLint & TypeScript
- No `any` types (use proper typing unless absolutely necessary)
- Prefer interfaces over types for object shapes
- Use const assertions where appropriate
- Implement proper error boundaries

### Import Organization
```typescript
// 1. React and Next.js imports
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 2. Third-party libraries
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

// 3. Internal components and utilities
import { Button } from '@/components/ui/button';
import { usePermissions } from '@/hooks/usePermissions';

// 4. Types and interfaces
import { IUser, UserRole } from './_types/user.types';
```

### Component Structure
```tsx
// 1. Imports
// 2. Types and interfaces
// 3. Component props interface
// 4. Component implementation
// 5. Default export

interface ComponentProps {
  // Props definition
}

const Component = ({ prop1, prop2 }: ComponentProps) => {
  // 1. Hooks
  // 2. State
  // 3. Effects
  // 4. Event handlers
  // 5. Render logic
  
  return (
    // JSX
  );
};

export default Component;
```

## 📚 Platform-Specific Guidelines

### 🛍️ **E-Commerce Store Features**
- **Product Catalog**: Search, filtering, categorization, variants
- **Shopping Cart**: Add/remove items, quantity updates, persistent cart
- **Checkout Process**: Guest checkout, multiple payment methods, order confirmation
- **User Accounts**: Registration, profile management, order history
- **SEO & Performance**: Server-side rendering, meta tags, sitemap generation

### 👨‍💼 **Seller Dashboard Features**
- **Inventory Management**: Product CRUD, stock tracking, variant management
- **Order Processing**: Order status updates, shipping management, returns
- **Analytics**: Sales reports, performance metrics, revenue tracking
- **Store Management**: Store profile, policies, shipping settings
- **Communication**: Customer messages, order notifications

### ⚙️ **Admin Panel Features**
- **User Management**: Admin/seller/customer management with role assignment
- **Platform Oversight**: System monitoring, performance metrics, security logs
- **Content Management**: Categories, brands, site settings, CMS functionality
- **Financial Management**: Commission tracking, payout management, tax settings
- **System Configuration**: Platform settings, feature toggles, maintenance mode

### Platform-Specific State Management

#### 🛍️ **Store State**
```typescript
// Cart management
const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  
  const addToCart = (product: IProduct, quantity: number) => {
    // Cart logic
  };
  
  const removeFromCart = (productId: string) => {
    // Remove logic
  };
  
  return { items, addToCart, removeFromCart };
};

// Wishlist management
const useWishlist = () => {
  const { user } = useAuth();
  const [wishlistItems] = useGetWishlistQuery(user?.id, {
    skip: !user,
  });
  
  return { wishlistItems };
};
```

#### 👨‍💼 **Seller State**
```typescript
// Seller dashboard state
const useSellerDashboard = () => {
  const { data: analytics } = useGetSellerAnalyticsQuery();
  const { data: orders } = useGetSellerOrdersQuery();
  const { data: products } = useGetSellerProductsQuery();
  
  return { analytics, orders, products };
};
```

#### ⚙️ **Admin State**
```typescript
// Admin panel state with permissions
const useAdminData = () => {
  const { hasPermission } = usePermissions();
  
  const { data: users } = useGetUsersQuery(undefined, {
    skip: !hasPermission('users.read'),
  });
  
  const { data: sellers } = useGetSellersQuery(undefined, {
    skip: !hasPermission('sellers.read'),
  });
  
  return { users, sellers };
};
```

## 🔗 Integration Patterns

### AWS S3 File Uploads
```typescript
// Use presigned URLs for secure uploads
const uploadFile = async (file: File) => {
  const { uploadUrl, publicUrl } = await getPresignedUrl(file.type);
  await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
  });
  return publicUrl;
};
```

### Permission-Based Rendering
```typescript
// Conditional feature access
const AdminPanel = () => {
  const { hasPermission } = usePermissions();
  
  return (
    <div>
      {hasPermission('users.read') && <UsersList />}
      {hasPermission('products.read') && <ProductsList />}
      {hasPermission('settings.read') && <SettingsPanel />}
    </div>
  );
};
```

---

## 🎯 Key Reminders for Copilot

1. **Always use shadcn/ui components** - don't create custom UI components
2. **Follow the established folder structure** with `_components` and `_types`
3. **Use RTK Query for all API interactions** with proper error handling
4. **Include TypeScript interfaces** for all data structures
5. **Implement permission checks** using `usePermissions` hook for admin/seller areas
6. **Use Zod validation** for all forms and API responses
7. **Follow naming conventions** consistently across the codebase
8. **Include proper error handling** with toast notifications
9. **Use established layout patterns** like `AdminPageLayout`
10. **Consider performance** with memoization and debouncing
11. **Prefer external libraries** for complex utilities, custom functions for simple logic
12. **Include security considerations** in all implementations
13. **Design mobile-first for store**, desktop-first for seller/admin
14. **Implement proper authentication guards** for each platform
15. **Use platform-specific components** in correct directories

### Platform-Specific Reminders

#### 🛍️ **For E-Commerce Store:**
- Focus on **conversion optimization** and **user experience**
- Implement **SEO best practices** with meta tags and structured data
- Use **responsive design** with mobile-first approach
- **Cart persistence** across sessions for better UX
- **Guest checkout** option for faster conversions

#### 👨‍💼 **For Seller Dashboard:**
- Emphasize **data visualization** and **analytics**
- Provide **bulk operation** capabilities
- Implement **real-time updates** for orders and inventory
- Focus on **workflow efficiency** for sellers
- Desktop-optimized with **data-heavy interfaces**

#### ⚙️ **For Admin Panel:**
- **Permission-based access** to all features
- **System monitoring** and **health indicators**
- **Advanced filtering** and **search capabilities**
- **Audit logs** for security and compliance
- **Bulk operations** with **confirmation dialogs**

This document should guide all development decisions and ensure consistency across the entire e-commerce platform.