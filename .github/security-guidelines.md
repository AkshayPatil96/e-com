# Security Guidelines for GitHub Copilot - Complete E-Commerce Platform

## 🔐 Security-First Development Principles

This guide covers security requirements for all three platforms:
- **🛍️ E-Commerce Store** (Public-facing)
- **👨‍💼 Seller Dashboard** (Seller management)
- **⚙️ Admin Panel** (Administrative interface)

## Platform-Specific Security Requirements

### 🛍️ **E-Commerce Store Security**
```typescript
// Guest checkout security
const validateGuestCheckout = (checkoutData: GuestCheckoutData) => {
  const schema = z.object({
    email: z.string().email('Valid email required'),
    shipping: addressSchema,
    billing: addressSchema,
    paymentMethod: z.string().min(1, 'Payment method required'),
  });
  
  return schema.parse(checkoutData);
};

// Cart validation and sanitization
const validateCartItem = (item: CartItem) => {
  return {
    productId: sanitizeId(item.productId),
    quantity: Math.max(1, Math.min(item.quantity, 999)),
    variants: item.variants?.map(sanitizeString) || [],
  };
};

// Product search input sanitization
const sanitizeSearchQuery = (query: string) => {
  return query
    .trim()
    .replace(/[<>]/g, '') // Remove potential XSS characters
    .substring(0, 100); // Limit length
};
```

### 👨‍💼 **Seller Dashboard Security**
```typescript
// Seller-only resource access
const SellerResourceGuard = ({ children, sellerId }: { 
  children: React.ReactNode; 
  sellerId: string; 
}) => {
  const { user } = useAuth();
  
  if (user?.role !== 'seller' || user?.sellerId !== sellerId) {
    return <AccessDenied message="Access limited to resource owner" />;
  }
  
  return <>{children}</>;
};

// Inventory update validation
const validateInventoryUpdate = (data: InventoryUpdateData) => {
  const schema = z.object({
    productId: z.string().uuid('Invalid product ID'),
    quantity: z.number().min(0, 'Quantity cannot be negative').max(99999),
    price: z.number().min(0.01, 'Price must be positive'),
    sku: z.string().max(50, 'SKU too long'),
  });
  
  return schema.parse(data);
};

// Order status validation
const validateOrderStatusChange = (currentStatus: string, newStatus: string) => {
  const validTransitions = {
    'pending': ['confirmed', 'cancelled'],
    'confirmed': ['processing', 'cancelled'], 
    'processing': ['shipped', 'cancelled'],
    'shipped': ['delivered'],
    'delivered': [],
    'cancelled': [],
  };
  
  return validTransitions[currentStatus]?.includes(newStatus);
};
```

### ⚙️ **Admin Panel Security**
```typescript
// Super admin operations
const SuperAdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  
  if (!hasPermission('admin.super') || user?.role !== 'superadmin') {
    return <AccessDenied message="Super admin access required" />;
  }
  
  return <>{children}</>;
};

// Sensitive operation confirmation
const ConfirmSensitiveOperation = ({ 
  operation, 
  onConfirm, 
  children 
}: {
  operation: string;
  onConfirm: () => void;
  children: React.ReactNode;
}) => {
  const [confirmText, setConfirmText] = useState('');
  const requiredText = `CONFIRM-${operation.toUpperCase()}`;
  
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm {operation}</AlertDialogTitle>
          <AlertDialogDescription>
            Type "{requiredText}" to confirm this action.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Input
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder={`Type ${requiredText}`}
        />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={confirmText !== requiredText}
            className="bg-destructive"
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// Audit logging for admin actions
const logAdminAction = (action: string, details: Record<string, any>) => {
  console.log(`[ADMIN_AUDIT] ${action}:`, {
    timestamp: new Date().toISOString(),
    adminId: getCurrentUserId(),
    sessionId: getSessionId(),
    ipAddress: getClientIP(),
    userAgent: navigator.userAgent,
    ...details,
  });
  
  // Send to audit service
  auditService.log({
    type: 'ADMIN_ACTION',
    action,
    details,
  });
};
```

### Authentication & Authorization
```typescript
// ✅ Always include credentials in API calls
const apiCall = {
  url: '/api/endpoint',
  credentials: 'include' as const,
  headers: {
    'Content-Type': 'application/json',
  }
};

// ✅ Permission-based access control
const { hasPermission } = usePermissions();
if (!hasPermission('resource.action')) {
  return <AccessDenied />;
}

// ✅ Route protection
const ProtectedRoute = ({ children, permission }: { children: React.ReactNode, permission: string }) => {
  const { hasPermission } = usePermissions();
  return hasPermission(permission) ? children : <Navigate to="/unauthorized" />;
};
```

### Input Validation & Sanitization
```typescript
// ✅ Always use Zod for validation
const userSchema = z.object({
  email: z.string().email('Invalid email'),
  name: z.string().min(2).max(50),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone format'),
});

// ✅ Sanitize user inputs before rendering
const sanitizeHtml = (dirty: string) => {
  return DOMPurify.sanitize(dirty);
};

// ❌ Never trust user input
const UnsafeComponent = ({ userContent }: { userContent: string }) => (
  <div dangerouslySetInnerHTML={{ __html: userContent }} /> // DANGEROUS
);

// ✅ Safe alternative
const SafeComponent = ({ userContent }: { userContent: string }) => (
  <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(userContent) }} />
);
```

### File Upload Security (Multi-Platform)
```typescript
// Platform-specific file upload validation
const getUploadConfig = (platform: 'store' | 'seller' | 'admin') => {
  const configs = {
    store: {
      maxSize: 2 * 1024 * 1024, // 2MB for profile images
      allowedTypes: ['image/jpeg', 'image/png'],
      directory: 'customer-uploads',
    },
    seller: {
      maxSize: 10 * 1024 * 1024, // 10MB for product images
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
      directory: 'seller-products',
    },
    admin: {
      maxSize: 50 * 1024 * 1024, // 50MB for system files
      allowedTypes: ['image/*', 'application/pdf', 'text/csv'],
      directory: 'admin-uploads',
    },
  };
  
  return configs[platform];
};

// Secure file upload with platform checks
const uploadFile = async (file: File, platform: 'store' | 'seller' | 'admin') => {
  const config = getUploadConfig(platform);
  
  // Validate file type
  if (!config.allowedTypes.some(type => 
    type === file.type || file.type.startsWith(type.replace('*', ''))
  )) {
    throw new Error('Invalid file type for this platform');
  }
  
  // Validate file size
  if (file.size > config.maxSize) {
    throw new Error(`File too large. Max size: ${config.maxSize / 1024 / 1024}MB`);
  }
  
  // Generate secure filename
  const sanitizedName = sanitizeFileName(file.name);
  const uniqueFilename = `${Date.now()}-${crypto.randomUUID()}-${sanitizedName}`;
  
  // Use presigned URLs for secure uploads
  const { uploadUrl, publicUrl } = await getPresignedUrl({
    fileType: file.type,
    fileName: uniqueFilename,
    directory: config.directory,
  });
  
  await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });
  
  return { publicUrl, fileName: uniqueFilename };
};

// Sanitize file names
const sanitizeFileName = (fileName: string): string => {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 100);
};
```

### Payment Security (Store-Specific)
```typescript
// Payment data handling
const handlePaymentData = (paymentData: PaymentData) => {
  // NEVER store sensitive payment info client-side
  const sanitizedData = {
    paymentMethod: paymentData.method,
    // Only store non-sensitive identifiers
    cardLast4: paymentData.cardNumber?.slice(-4),
    cardType: detectCardType(paymentData.cardNumber),
  };
  
  // Send sensitive data directly to payment processor
  return processPaymentSecurely(paymentData);
};

// Secure payment form
const PaymentForm = () => {
  // Use payment processor's secure elements
  return (
    <div>
      <StripeElements>
        <CardElement 
          options={{
            hidePostalCode: true,
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
              },
            },
          }}
        />
      </StripeElements>
    </div>
  );
};

// Order total validation
const validateOrderTotal = (cartItems: CartItem[], calculatedTotal: number) => {
  const serverCalculated = cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  
  if (Math.abs(serverCalculated - calculatedTotal) > 0.01) {
    throw new Error('Order total mismatch - possible tampering');
  }
  
  return true;
};
```

### API Security Best Practices
```typescript
// ✅ Proper error handling without exposing internals
const handleApiError = (error: any) => {
  console.error('API Error:', error); // Log for debugging
  
  if (error.status === 401) {
    toast.error('Please log in again');
    // Redirect to login
  } else if (error.status === 403) {
    toast.error('You do not have permission for this action');
  } else if (error.status >= 500) {
    toast.error('Server error. Please try again later');
  } else {
    toast.error('An error occurred. Please try again');
  }
};

// ✅ Rate limiting awareness
const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'include',
    prepareHeaders: (headers) => {
      // Add CSRF token if available
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        headers.set('X-CSRF-Token', csrfToken);
      }
      return headers;
    },
  }),
  // Add retry logic with exponential backoff
  endpoints: (builder) => ({
    getData: builder.query({
      query: () => '/data',
      extraOptions: {
        maxRetries: 3,
        retryCondition: (error) => error.status >= 500,
      },
    }),
  }),
});
```

### Environment & Configuration Security
```typescript
// ✅ Environment variable validation
const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_APP_ENV: z.enum(['development', 'staging', 'production']),
  // Never expose sensitive data in NEXT_PUBLIC_ variables
});

const env = envSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
});

// ❌ Never expose sensitive data client-side
// const API_SECRET = process.env.NEXT_PUBLIC_API_SECRET; // WRONG!

// ✅ Use server-side for sensitive operations
// pages/api/secure-endpoint.ts
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiSecret = process.env.API_SECRET; // Server-side only
  // Handle secure operations
}
```

### State Management Security
```typescript
// ✅ Secure state management
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null as IUser | null,
    isAuthenticated: false,
    permissions: [] as string[],
  },
  reducers: {
    setAuth: (state, action) => {
      // Validate payload structure
      const { user, permissions } = action.payload;
      state.user = user;
      state.isAuthenticated = !!user;
      state.permissions = permissions || [];
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.permissions = [];
    },
  },
});

// ✅ Permission validation hook
const usePermissions = () => {
  const permissions = useAppSelector(state => state.auth.permissions);
  
  const hasPermission = useCallback((permission: string) => {
    return permissions.includes(permission) || permissions.includes('admin.all');
  }, [permissions]);
  
  return { hasPermission };
};
```

### Content Security Policy (CSP)
```typescript
// next.config.js - Add CSP headers
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self' https://api.yourdomain.com",
    ].join('; '),
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
];
```

## 🚨 Platform-Specific Security Checklist

### 🛍️ **E-Commerce Store Security Checklist**
- [ ] **Guest Checkout Security**: Validate all guest user inputs
- [ ] **Cart Validation**: Prevent cart tampering and price manipulation
- [ ] **Payment Security**: Never store sensitive payment data client-side
- [ ] **Order Total Validation**: Server-side price calculation verification
- [ ] **Search Input Sanitization**: Prevent XSS in search queries
- [ ] **Product Reviews**: Validate and sanitize user-generated content
- [ ] **Email Validation**: Prevent email injection attacks
- [ ] **Session Management**: Secure cart persistence across sessions

### 👨‍💼 **Seller Dashboard Security Checklist**
- [ ] **Resource Ownership**: Verify seller can only access their own data
- [ ] **Inventory Updates**: Validate stock levels and price changes
- [ ] **Order Management**: Verify seller can only modify their orders
- [ ] **File Uploads**: Validate product images and documents
- [ ] **Commission Calculations**: Prevent manipulation of financial data
- [ ] **Customer Data**: Limit access to necessary customer information
- [ ] **API Rate Limiting**: Prevent abuse of seller API endpoints
- [ ] **Data Export**: Secure handling of sensitive business data

### ⚙️ **Admin Panel Security Checklist**  
- [ ] **Permission Verification**: Every action checks proper permissions
- [ ] **Audit Logging**: All admin actions are logged with details
- [ ] **Sensitive Operations**: Require additional confirmation
- [ ] **System Access**: Monitor and log all system-level changes
- [ ] **User Management**: Secure creation/modification of user accounts
- [ ] **Financial Data**: Extra protection for commission and payout data
- [ ] **System Configuration**: Validate all configuration changes
- [ ] **Security Monitoring**: Track suspicious admin activities

### **Universal Security Checklist (All Platforms)**
- [ ] **Authentication**: Are routes properly protected?
- [ ] **Authorization**: Are permissions checked?
- [ ] **Input Validation**: Are all inputs validated with Zod?
- [ ] **Output Encoding**: Is user content properly sanitized?
- [ ] **Error Handling**: Are errors handled without exposing internals?
- [ ] **API Calls**: Do all requests include proper credentials?
- [ ] **State Management**: Is sensitive data properly managed?
- [ ] **File Uploads**: Are file types and sizes validated?

### Common Security Antipatterns to Avoid:
❌ `dangerouslySetInnerHTML` without sanitization
❌ Client-side storage of sensitive data
❌ Exposing API secrets in client code  
❌ Trusting user input without validation
❌ Missing permission checks on components
❌ Inadequate error handling
❌ Unvalidated file uploads
❌ Missing CSRF protection

### Security Testing Approach:
1. **Permission Testing**: Verify access controls work correctly
2. **Input Validation**: Test with malicious payloads
3. **Error Handling**: Ensure no sensitive information leaks
4. **File Upload Testing**: Try various file types and sizes
5. **Authentication Flow**: Test token refresh and logout
6. **Cross-site Testing**: Verify CSRF protection

## 🔍 Security Monitoring & Logging

```typescript
// ✅ Security event logging
const logSecurityEvent = (event: string, details: Record<string, any>) => {
  console.log(`[SECURITY] ${event}:`, {
    timestamp: new Date().toISOString(),
    userId: getCurrentUserId(),
    sessionId: getSessionId(),
    ...details,
  });
};

// Usage examples
logSecurityEvent('UNAUTHORIZED_ACCESS_ATTEMPT', { resource: 'admin.users' });
logSecurityEvent('FAILED_LOGIN_ATTEMPT', { email: user.email });
logSecurityEvent('FILE_UPLOAD_REJECTED', { fileType: file.type, size: file.size });
```

Remember: Security is not an afterthought - it should be built into every component and feature from the beginning.