# Authentication Logic Implementation Explained

Here's a comprehensive breakdown of the authentication system I implemented:

## **Core Components**

### **1. Auth Context ([AuthContextMock.tsx](cci:7://file:///Users/raa/raa-imp/React_Native_App/expo_apps/safe_online_expo/contexts/AuthContextMock.tsx:0:0-0:0))**
The central authentication manager that provides:

#### **State Management**
- **`user`** - Basic user object with `uid` and `phoneNumber`
- **`userData`** - Complete user profile (name, address, age, gender, location, etc.)
- **`authToken`** - API bearer token for authenticated requests
- **`loading`** - Loading state during initialization

#### **Key Methods**

**[setAuthToken(token)](cci:1://file:///Users/raa/raa-imp/React_Native_App/expo_apps/safe_online_expo/contexts/AuthContextMock.tsx:70:2-83:4)**
```typescript
// Saves token to both AsyncStorage and state
await AsyncStorage.setItem('authToken', token);
setAuthTokenState(token);
```

**[fetchUserFromAPI(token)](cci:1://file:///Users/raa/raa-imp/React_Native_App/expo_apps/safe_online_expo/contexts/AuthContextMock.tsx:85:2-131:4)**
```typescript
// Calls: GET https://safe-online.rwcs.in/api/user
// Headers: Authorization: Bearer <token>
// Maps API response to app's UserData structure
// Saves user data to AsyncStorage and state
```

**[signOut()](cci:1://file:///Users/raa/raa-imp/React_Native_App/expo_apps/safe_online_expo/contexts/AuthContextMock.tsx:204:2-216:4)**
```typescript
// Removes: user, userData, authToken from AsyncStorage
// Clears all state
```

**[loadUser()](cci:1://file:///Users/raa/raa-imp/React_Native_App/expo_apps/safe_online_expo/contexts/AuthContextMock.tsx:46:2-68:4)**
```typescript
// Runs on app startup
// Loads user, userData, and authToken from AsyncStorage
// Optionally can refresh data from API
```

---

## **2. Login Flow ([app/auth/login.tsx](cci:7://file:///Users/raa/raa-imp/React_Native_App/expo_apps/safe_online_expo/app/auth/login.tsx:0:0-0:0))**

### **Step-by-Step Process:**

1. **User enters phone number** → Sends OTP request to API
   ```typescript
   POST https://safe-online.rwcs.in/api/send-otp
   Body: { phone: "+917002453818" }
   ```

2. **User enters OTP** → Verifies OTP with API
   ```typescript
   POST https://safe-online.rwcs.in/api/verify-otp
   Body: { phone: "+917002453818", otp: "369158" }
   ```

3. **API Response Handling:**
   
   **Case A: New User (Status 206)**
   ```typescript
   // Redirect to registration
   router.push('/auth/register')
   ```
   
   **Case B: Existing User (Status 200)**
   ```typescript
   const token = response.data.token;
   
   // Save token
   await setAuthToken(token);
   
   // Fetch complete user profile from API
   await fetchUserFromAPI(token);
   
   // Navigate to app
   router.replace('/(tabs)');
   ```

---

## **3. Registration Flow ([app/auth/register.tsx](cci:7://file:///Users/raa/raa-imp/React_Native_App/expo_apps/safe_online_expo/app/auth/register.tsx:0:0-0:0))**

### **Process:**

1. **User fills registration form** (name, age, gender, address, location)

2. **Submit to API:**
   ```typescript
   POST https://safe-online.rwcs.in/api/register-user
   Body: { name, phone, age, gender, address_line1, latitude, longitude, ... }
   ```

3. **On Success:**
   ```typescript
   const token = response.data.token;
   
   // Save token
   await setAuthToken(token);
   
   // Fetch user data from API (ensures consistency)
   await fetchUserFromAPI(token);
   
   // Navigate to app
   router.replace('/(tabs)');
   ```

---

## **4. Profile Screen (`app/(tabs)/dashboard.tsx`)**

### **Data Source:**
```typescript
const { userData, signOut } = useAuth();
```

- **Before:** Used URL params `{ userDetail: JSON.stringify(...) }`
- **Now:** Uses `userData` directly from auth context
- **Benefit:** Always shows current data from API, no stale params

### **Logout Logic:**
```typescript
const handleLogout = () => {
  Alert.alert('Logout', 'Are you sure?', [
    { text: 'Cancel' },
    { 
      text: 'Logout',
      onPress: async () => {
        await signOut(); // Clears token, user, userData
        router.replace('/auth/login');
      }
    }
  ]);
};
```

---

## **5. Root Layout ([app/_layout.tsx](cci:7://file:///Users/raa/raa-imp/React_Native_App/expo_apps/safe_online_expo/app/_layout.tsx:0:0-0:0))**

### **Authentication Guard:**
```typescript
useEffect(() => {
  if (loading) return; // Wait for auth state to load
  
  const inAuthGroup = segments[0] === 'auth';
  const inTabsGroup = segments[0] === '(tabs)';
  
  if (!user) {
    // Not logged in → redirect to login
    router.replace('/auth/login');
  } 
  else if (user && !userData?.isRegistered) {
    // Logged in but incomplete profile → redirect to register
    router.replace('/auth/register');
  } 
  else if (user && userData?.isRegistered) {
    // Fully authenticated → allow tabs access
    if (!inTabsGroup) {
      router.replace('/(tabs)');
    }
  }
}, [user, userData, segments, loading]);
```

---

## **Data Flow Diagram**

```
┌─────────────────┐
│   App Starts    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Load from      │
│  AsyncStorage:  │
│  - user         │
│  - userData     │
│  - authToken    │
└────────┬────────┘
         │
         ▼
    ┌───────┐
    │ User? │
    └───┬───┘
        │
   ┌────┴────┐
   │         │
  NO        YES
   │         │
   ▼         ▼
┌──────┐  ┌──────────────┐
│Login │  │ isRegistered?│
└──────┘  └──────┬───────┘
              ┌──┴──┐
              │     │
             NO    YES
              │     │
              ▼     ▼
         ┌────────┐ ┌─────┐
         │Register│ │Tabs │
         └────────┘ └─────┘
```

---

## **Key Benefits**

1. **Token-based authentication** - Secure API access
2. **Persistent sessions** - User stays logged in across app restarts
3. **Single source of truth** - API is authoritative for user data
4. **Automatic navigation** - Users are routed based on auth state
5. **Clean logout** - All credentials cleared properly

The system ensures that user data is always fetched from the API after authentication, maintaining data consistency and security! 🔐


# What Happens if Admin Deletes Token from API Server

## **Current Behavior**

If an admin deletes/revokes the token from the API server, here's what happens:

### **Immediate Impact**

1. **Token becomes invalid** on the server side
2. **App still has the token** stored locally in AsyncStorage
3. **User appears logged in** in the app (because local state is valid)

### **When User Makes API Request**

```typescript
const response = await axios.get('https://safe-online.rwcs.in/api/user', {
  headers: {
    'Authorization': `Bearer ${deletedToken}`,
    'Accept': 'application/json',
  },
});
```

**Expected API Response:**
- **Status: 401 Unauthorized**
- **Message: "Unauthenticated"** or **"Token is invalid"**

### **Problem: No Error Handling Currently**

The app will:
1. ❌ Show error in console
2. ❌ User stays on the screen (appears logged in)
3. ❌ No automatic logout
4. ❌ No redirect to login

---

## **Recommended Solution**

You need to implement **global API error handling** with automatic logout on 401 errors.

### **Option 1: Axios Interceptor (Recommended)**

Create an API client with automatic token validation:

```typescript
// utils/apiClient.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const apiClient = axios.create({
  baseURL: 'https://safe-online.rwcs.in/api',
  headers: {
    'Accept': 'application/json',
  },
});

// Request interceptor - Add token to all requests
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle 401 errors globally
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token is invalid/expired/deleted
      console.log('Token invalid - logging out');
      
      // Clear local storage
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('authToken');
      
      // Redirect to login
      router.replace('/auth/login');
      
      // Show alert
      Alert.alert(
        'Session Expired',
        'Your session has expired. Please login again.',
        [{ text: 'OK' }]
      );
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### **Usage in Components**

```typescript
// Instead of axios.get()
import apiClient from '@/utils/apiClient';

// Automatically includes token and handles 401
const response = await apiClient.get('/user');
```

---

### **Option 2: Update Auth Context**

Add token validation to [fetchUserFromAPI](cci:1://file:///Users/raa/raa-imp/React_Native_App/expo_apps/safe_online_expo/contexts/AuthContextMock.tsx:85:2-131:4):

```typescript
const fetchUserFromAPI = async (token: string) => {
  try {
    const response = await axios.get('https://safe-online.rwcs.in/api/user', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (response.status === 200 && response.data) {
      // ... existing code to save user data
    }
  } catch (error: any) {
    // Handle 401 - Token deleted/invalid
    if (error.response?.status === 401) {
      console.log('Token invalid - clearing auth state');
      
      // Clear everything
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('authToken');
      
      setUser(null);
      setUserData(null);
      setAuthTokenState(null);
      
      throw new Error('Token is invalid. Please login again.');
    }
    
    console.error('Error fetching user from API:', error.response?.data || error.message);
    throw error;
  }
};
```

---

### **Option 3: Add Token Validation on App Load**

Update [loadUser()](cci:1://file:///Users/raa/raa-imp/React_Native_App/expo_apps/safe_online_expo/contexts/AuthContextMock.tsx:46:2-68:4) to verify token on startup:

```typescript
const loadUser = async () => {
  try {
    const userJson = await AsyncStorage.getItem('user');
    const userDataJson = await AsyncStorage.getItem('userData');
    const token = await AsyncStorage.getItem('authToken');
    
    if (userJson) setUser(JSON.parse(userJson));
    if (userDataJson) setUserData(JSON.parse(userDataJson));
    
    if (token) {
      setAuthTokenState(token);
      
      // Validate token with API
      try {
        await fetchUserFromAPI(token); // This will fail if token is deleted
      } catch (error) {
        // Token invalid - clear everything
        console.log('Token validation failed on startup');
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('userData');
        await AsyncStorage.removeItem('authToken');
        setUser(null);
        setUserData(null);
        setAuthTokenState(null);
      }
    }
  } catch (error) {
    console.error('Error loading user:', error);
  } finally {
    setLoading(false);
  }
};
```

---

## **Complete Flow After Token Deletion**

```
┌─────────────────────┐
│ Admin deletes token │
│   on API server     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ User opens app or   │
│ makes API request   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ API returns 401     │
│ Unauthorized        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Interceptor catches │
│ 401 error           │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Clear AsyncStorage: │
│ - user              │
│ - userData          │
│ - authToken         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Show alert:         │
│ "Session Expired"   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Redirect to         │
│ /auth/login         │
└─────────────────────┘
```

---

## **Recommended Implementation Priority**

1. ✅ **Implement Axios Interceptor** (Option 1) - Best practice, handles all API calls
2. ✅ **Add token validation on app load** (Option 3) - Catches deleted tokens immediately
3. ✅ **Add error handling in fetchUserFromAPI** (Option 2) - Backup safety

This ensures users are automatically logged out when their token is invalid, maintaining security and a good user experience! 🔐

---

## **✅ Implementation Status (Completed)**

### **What Was Implemented:**

#### **1. Enhanced Auth Context (`contexts/AuthContextMock.tsx`)**

✅ **Token Validation on App Startup**
- `loadUser()` now validates token with API when app starts
- If token is invalid (401), automatically clears all auth data
- Prevents users from accessing app with revoked tokens

✅ **Comprehensive 401 Error Handling in `fetchUserFromAPI()`**
- Detects 401 Unauthorized responses
- Automatically clears: `user`, `userData`, `authToken` from AsyncStorage
- Clears all state variables
- Shows "Session Expired" alert to user
- Throws error to prevent further execution

✅ **Added Request Timeout**
- 15-second timeout for API requests
- Prevents hanging requests

#### **2. Enhanced Login Screen (`app/auth/login.tsx`)**

✅ **Better Error Handling**
- Distinguishes between 401 errors and other errors
- Shows appropriate messages:
  - "Authentication Failed" for token issues
  - "Failed to load user data" for network issues

#### **3. Enhanced Registration Screen (`app/auth/register.tsx`)**

✅ **Better Error Handling**
- Handles token validation failures after registration
- Redirects to login if token is invalid
- Clear error messages for users

---

### **How It Works Now:**

#### **Scenario 1: Admin Deletes Token While App is Running**
```
1. User makes any API request
2. API returns 401 Unauthorized
3. fetchUserFromAPI() catches 401 error
4. Clears all auth data from AsyncStorage
5. Shows "Session Expired" alert
6. User must login again
```

#### **Scenario 2: User Opens App with Deleted Token**
```
1. App starts → loadUser() runs
2. Loads token from AsyncStorage
3. Validates token by calling fetchUserFromAPI()
4. API returns 401 (token deleted)
5. Automatically clears all auth data
6. User sees login screen
7. No "Session Expired" alert (silent cleanup)
```

#### **Scenario 3: Token Deleted During Login/Registration**
```
1. User completes OTP/registration
2. Receives token from API
3. Attempts to fetch user data
4. API returns 401 (token already invalid)
5. Shows appropriate error message
6. Redirects to login screen
```

---

### **Testing the Implementation:**

#### **Test 1: Delete Token While Logged In**
```bash
# On Laravel backend, delete the token
php artisan tinker
>>> PersonalAccessToken::where('id', TOKEN_ID)->delete();

# In the app:
# 1. Navigate to Profile tab (triggers API call)
# 2. Should see "Session Expired" alert
# 3. Should be redirected to login
```

#### **Test 2: Delete Token, Then Restart App**
```bash
# Delete token on backend
# Close and reopen the app
# Should automatically redirect to login (no alert)
```

#### **Test 3: Invalid Token During Login**
```bash
# Modify API to return invalid token
# Try to login
# Should show "Authentication Failed" message
```

---

### **Security Benefits:**

1. ✅ **Immediate Token Validation** - Tokens are validated on every app start
2. ✅ **Automatic Cleanup** - Invalid tokens are removed automatically
3. ✅ **No Stale Sessions** - Users can't access app with revoked tokens
4. ✅ **User Feedback** - Clear messages about session expiration
5. ✅ **Graceful Degradation** - Handles network errors separately from auth errors

---

### **Code Locations:**

- **Auth Context**: `/contexts/AuthContextMock.tsx`
  - Lines 47-77: `loadUser()` with token validation
  - Lines 87-146: `fetchUserFromAPI()` with 401 handling

- **Login Screen**: `/app/auth/login.tsx`
  - Lines 95-123: Enhanced error handling

- **Register Screen**: `/app/auth/register.tsx`
  - Lines 199-236: Enhanced error handling

**Implementation Date**: October 26, 2025
**Status**: ✅ Fully Implemented and Ready for Testing