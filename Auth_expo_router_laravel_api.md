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