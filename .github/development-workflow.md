# Development Workflow & Best Practices - Complete E-Commerce Platform

## 🚀 Multi-Platform Feature Development Workflow

This guide covers development practices for all three platforms:
- **🛍️ E-Commerce Store** (Public-facing customer experience)
- **👨‍💼 Seller Dashboard** (Seller management interface)  
- **⚙️ Admin Panel** (Administrative platform management)

### 1. Planning Phase
```markdown
## Feature: [Feature Name] - [Platform: Store/Seller/Admin]

### Requirements
- [ ] Define user stories and acceptance criteria
- [ ] Identify target platform(s) and user roles
- [ ] Plan responsive design requirements (mobile/desktop)
- [ ] Define API endpoints and data structures
- [ ] Consider cross-platform integration needs

### Platform-Specific Planning
#### For Store Features:
- [ ] SEO requirements and meta tag strategy
- [ ] Mobile-first responsive design
- [ ] Guest user experience considerations
- [ ] Cart/checkout integration needs
- [ ] Performance optimization requirements

#### For Seller Features:
- [ ] Data visualization and analytics requirements
- [ ] Seller-specific permission checks
- [ ] Real-time update mechanisms
- [ ] Bulk operation capabilities
- [ ] Desktop-optimized interface design

#### For Admin Features:
- [ ] Admin permission levels and access control
- [ ] System monitoring and audit requirements
- [ ] Advanced filtering and search capabilities
- [ ] Bulk management operations
- [ ] Security and compliance considerations

### Technical Planning  
- [ ] Create TypeScript interfaces in appropriate `_types/` folder
- [ ] Design Zod validation schemas for platform-specific needs
- [ ] Plan RTK Query endpoints and caching strategy
- [ ] Identify reusable vs platform-specific components
- [ ] Consider performance implications per platform
```

### 2. Implementation Phase
```typescript
// Step 1: Define types and interfaces
// src/app/admin/(routes)/[feature]/_types/[feature].types.ts
export interface IFeatureItem {
  _id: string;
  name: string;
  status: FeatureStatus;
  // ... other properties
}

// Step 2: Create API slice
// src/redux/[feature]/[feature]Api.ts
export const featureApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFeatures: builder.query<IFeatureResponse, IFeatureQueryParams>({
      query: (params) => ({
        url: '/api/features',
        params,
        credentials: 'include',
      }),
      providesTags: ['Feature'],
    }),
  }),
});

// Step 3: Create components with proper structure
// src/app/admin/(routes)/[feature]/_components/FeatureForm.tsx
export function FeatureForm({ onSubmit, feature, mode }: FeatureFormProps) {
  // Implementation following established patterns
}
```

### 3. Testing Phase
```typescript
// Permission testing
const { hasPermission } = usePermissions();
if (!hasPermission('feature.read')) {
  return <AccessDenied />;
}

// Form validation testing
const testFormValidation = () => {
  // Test required fields
  // Test field length limits
  // Test email/phone format validation
  // Test custom validation rules
};

// API error handling testing
const testErrorScenarios = () => {
  // Test network errors
  // Test validation errors
  // Test permission errors
  // Test server errors
};
```

## 📋 Platform-Specific Code Review Checklist

### 🛍️ **E-Commerce Store Review**
- [ ] Mobile-first responsive design implemented
- [ ] SEO meta tags and structured data included
- [ ] Guest user experience optimized
- [ ] Cart state management properly implemented
- [ ] Product images optimized with lazy loading
- [ ] Checkout flow follows best practices
- [ ] Accessibility compliance (WCAG 2.1 AA)
- [ ] Performance optimized (Core Web Vitals)

### 👨‍💼 **Seller Dashboard Review**
- [ ] Desktop-first design (1024px+) with tablet fallback
- [ ] Seller role verification implemented
- [ ] Data visualization components used appropriately
- [ ] Real-time updates implemented where needed
- [ ] Bulk operation capabilities included
- [ ] Analytics tracking implemented
- [ ] Seller-specific permission checks in place
- [ ] Workflow efficiency considerations addressed

### ⚙️ **Admin Panel Review**
- [ ] Admin role and granular permissions verified
- [ ] Desktop-only design (1024px+) appropriate
- [ ] System monitoring capabilities included
- [ ] Audit logging implemented for sensitive operations
- [ ] Advanced filtering and search implemented
- [ ] Bulk operations with confirmation dialogs
- [ ] Security considerations for admin-level access
- [ ] Performance impact on system resources considered

### **Universal Code Quality Checks**
- [ ] TypeScript strict compliance
- [ ] No `any` types used (use proper typing)
- [ ] Interfaces defined for all data structures
- [ ] Proper error handling with try-catch blocks
- [ ] Consistent naming conventions followed
- [ ] Imports organized properly (React → Third-party → Internal → Types)
- [ ] shadcn/ui components used instead of custom ones
- [ ] Loading states and error boundaries included
- [ ] Toast notifications for user feedback

## 🛠️ Platform-Specific Development Patterns

### 🛍️ **E-Commerce Store Patterns**

#### Product Listing with SEO
```typescript
// Store product listing with SEO optimization
const ProductsPage = ({ params }: { params: { category?: string } }) => {
  const { data: products, isLoading } = useGetProductsQuery({
    category: params.category,
    limit: 20,
  });
  
  // SEO metadata
  const metadata = {
    title: `${params.category || 'All'} Products - Your Store`,
    description: `Browse our ${params.category || 'amazing'} products collection`,
    keywords: `${params.category}, products, shop, buy online`,
  };
  
  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              "name": metadata.title,
              "description": metadata.description,
            }),
          }}
        />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <ProductGrid products={products} isLoading={isLoading} />
        <ProductsPagination />
      </div>
    </>
  );
};
```

#### Shopping Cart Management
```typescript
// Persistent cart with localStorage
const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  
  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);
  
  // Save cart to localStorage on changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);
  
  const addToCart = useCallback((product: IProduct, quantity: number) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.productId === product._id);
      if (existingItem) {
        return prev.map(item =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { productId: product._id, quantity, product }];
    });
    
    toast.success('Added to cart');
  }, []);
  
  return { items, addToCart, removeFromCart, updateQuantity, clearCart };
};
```

### 👨‍💼 **Seller Dashboard Patterns**

#### Real-time Analytics Dashboard
```typescript
// Seller analytics with real-time updates
const SellerAnalyticsDashboard = () => {
  const { data: analytics, isLoading } = useGetSellerAnalyticsQuery(
    undefined,
    { pollingInterval: 30000 } // Poll every 30 seconds
  );
  
  const { data: recentOrders } = useGetSellerRecentOrdersQuery();
  const { data: inventory } = useGetSellerInventoryQuery();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnalyticsCard
        title="Today's Sales"
        value={analytics?.todaySales || 0}
        format="currency"
        trend={analytics?.salesTrend}
      />
      <AnalyticsCard
        title="Orders"
        value={analytics?.todayOrders || 0}
        format="number"
        trend={analytics?.ordersTrend}
      />
      <AnalyticsCard
        title="Revenue"
        value={analytics?.monthlyRevenue || 0}
        format="currency"
        trend={analytics?.revenueTrend}
      />
      
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <OrdersTable 
            data={recentOrders} 
            actions={['view', 'update-status']}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Low Stock Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <LowStockList items={inventory?.lowStock || []} />
        </CardContent>
      </Card>
    </div>
  );
};
```

#### Bulk Inventory Management
```typescript
// Bulk inventory operations
const InventoryBulkActions = ({ selectedItems }: { selectedItems: string[] }) => {
  const [updateInventory] = useUpdateBulkInventoryMutation();
  
  const handleBulkPriceUpdate = async (percentage: number) => {
    try {
      await updateInventory({
        itemIds: selectedItems,
        operation: 'price_adjustment',
        value: percentage,
      }).unwrap();
      
      toast.success(`Updated ${selectedItems.length} items`);
    } catch (error) {
      toast.error('Failed to update inventory');
    }
  };
  
  const handleBulkStatusChange = async (status: 'active' | 'inactive') => {
    try {
      await updateInventory({
        itemIds: selectedItems,
        operation: 'status_change',
        value: status,
      }).unwrap();
      
      toast.success(`${status === 'active' ? 'Activated' : 'Deactivated'} ${selectedItems.length} items`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };
  
  return (
    <div className="flex gap-2">
      <BulkPriceDialog onUpdate={handleBulkPriceUpdate} />
      <Button 
        variant="outline" 
        onClick={() => handleBulkStatusChange('active')}
      >
        Activate Selected
      </Button>
      <Button 
        variant="outline" 
        onClick={() => handleBulkStatusChange('inactive')}
      >
        Deactivate Selected
      </Button>
    </div>
  );
};
```

### ⚙️ **Admin Panel Patterns**

#### System Monitoring Dashboard
```typescript
// Admin system monitoring
const AdminSystemMonitor = () => {
  const { hasPermission } = usePermissions();
  const { data: systemHealth } = useGetSystemHealthQuery(
    undefined,
    { 
      pollingInterval: 10000, // Poll every 10 seconds
      skip: !hasPermission('system.monitor')
    }
  );
  
  if (!hasPermission('system.monitor')) {
    return <AccessDenied />;
  }
  
  return (
    <div className="space-y-6">
      <SystemHealthCards metrics={systemHealth} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>API Response Times</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponseTimeChart data={systemHealth?.apiMetrics} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Database Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <DatabaseMetrics data={systemHealth?.dbMetrics} />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent System Events</CardTitle>
        </CardHeader>
        <CardContent>
          <SystemEventsLog events={systemHealth?.recentEvents} />
        </CardContent>
      </Card>
    </div>
  );
};
```

#### Audit Trail Implementation
```typescript
// Admin audit trail
const AuditTrail = () => {
  const { hasPermission } = usePermissions();
  const [filters, setFilters] = useState<AuditFilters>({});
  
  const { data: auditLogs, isLoading } = useGetAuditLogsQuery({
    ...filters,
    page: 1,
    limit: 50,
  }, {
    skip: !hasPermission('audit.read')
  });
  
  const auditColumns: ColumnDef<AuditLog>[] = [
    {
      accessorKey: 'timestamp',
      header: 'Timestamp',
      cell: ({ row }) => formatDate(row.getValue('timestamp')),
    },
    {
      accessorKey: 'userId',
      header: 'User',
      cell: ({ row }) => <UserAvatarCell userId={row.getValue('userId')} />,
    },
    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }) => (
        <Badge variant={getActionVariant(row.getValue('action'))}>
          {row.getValue('action')}
        </Badge>
      ),
    },
    {
      accessorKey: 'resource',
      header: 'Resource',
    },
    {
      accessorKey: 'details',
      header: 'Details',
      cell: ({ row }) => (
        <AuditDetailsDialog details={row.getValue('details')} />
      ),
    },
  ];
  
  return (
    <AdminPageLayout title="Audit Trail">
      <div className="space-y-6">
        <AuditFilters filters={filters} onFiltersChange={setFilters} />
        <DataTable
          columns={auditColumns}
          data={auditLogs?.data || []}
          pagination={auditLogs?.pagination}
          isLoading={isLoading}
        />
      </div>
    </AdminPageLayout>
  );
};
```

## 🔧 Debugging Guidelines

### RTK Query Debugging
```typescript
// Enable RTK Query DevTools
const store = configureStore({
  reducer: {
    api: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      apiSlice.middleware,
      // Add logging in development
      process.env.MODE === 'development' ? logger : []
    ),
});

// Debug API calls
const useDebuggedQuery = (endpoint: any, args: any) => {
  const result = endpoint(args);
  
  useEffect(() => {
    console.log(`[API] ${endpoint.name}:`, {
      args,
      isLoading: result.isLoading,
      error: result.error,
      data: result.data,
    });
  }, [result.isLoading, result.error, result.data]);
  
  return result;
};
```

### Permission Debugging
```typescript
const usePermissionsDebug = () => {
  const { hasPermission, permissions } = usePermissions();
  
  const debugPermission = (permission: string) => {
    const hasAccess = hasPermission(permission);
    console.log(`[PERMISSION] ${permission}:`, {
      hasAccess,
      userPermissions: permissions,
    });
    return hasAccess;
  };
  
  return { debugPermission };
};
```

### Form Debugging
```typescript
const useFormDebug = (form: UseFormReturn) => {
  const watchedValues = form.watch();
  const errors = form.formState.errors;
  
  useEffect(() => {
    console.log('[FORM] State:', {
      values: watchedValues,
      errors,
      isValid: form.formState.isValid,
      isDirty: form.formState.isDirty,
    });
  }, [watchedValues, errors]);
};
```

## 📊 Performance Monitoring

### Component Performance
```typescript
const PerformanceWrapper: React.FC<{ name: string; children: React.ReactNode }> = ({ 
  name, 
  children 
}) => {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      console.log(`[PERF] ${name} render time: ${endTime - startTime}ms`);
    };
  });
  
  return <>{children}</>;
};

// Usage
<PerformanceWrapper name="ItemsList">
  <ItemsList />
</PerformanceWrapper>
```

### API Performance
```typescript
const performanceMiddleware: Middleware = () => (next) => (action) => {
  if (action.type.endsWith('/pending')) {
    console.time(`[API] ${action.type}`);
  }
  
  if (action.type.endsWith('/fulfilled') || action.type.endsWith('/rejected')) {
    console.timeEnd(`[API] ${action.type.replace(/\/(fulfilled|rejected)$/, '/pending')}`);
  }
  
  return next(action);
};
```

## 🎯 Quality Gates

### Pre-commit Checks
- [ ] TypeScript compilation passes
- [ ] ESLint rules pass
- [ ] No console.log statements in production code
- [ ] All imports are used
- [ ] Proper error handling implemented

### Pre-PR Checks
- [ ] All acceptance criteria met
- [ ] Permission checks implemented
- [ ] Responsive design verified
- [ ] Error scenarios tested
- [ ] Performance impact assessed

### Pre-deployment Checks
- [ ] Security review completed
- [ ] Performance benchmarks met
- [ ] Accessibility compliance verified
- [ ] Cross-browser compatibility tested
- [ ] Documentation updated