<!-- e040f64c-af30-49f9-bcc0-8900bc93a1be 2d1ff85b-cc3c-4000-8976-4231d549c9c8 -->
# Phone Number Login with OTP Implementation

## Overview

Create an authentication flow with phone number login (auto-detected) and OTP verification. Users will see login screens before accessing the main app content. Uses Jotai for state management and simple single-input OTP field.

## Implementation Steps

### 1. Install Required Dependencies

- Install `jotai` for state management
- Install `react-native-phone-number-input` for phone number input with auto-detection
- Install `@react-native-async-storage/async-storage` for storing auth state
- Install `@react-navigation/stack` for stack navigation (login flow)

### 2. Create Authentication State Management with Jotai

- **File**: `src/store/authAtoms.ts`
- Create Jotai atoms for authentication state:
- `authAtom` - stores auth state (isLoggedIn, phoneNumber, user data)
- `phoneNumberAtom` - stores phone number during login flow
- `otpAtom` - stores OTP input value
- Use `atomWithStorage` from Jotai utils with AsyncStorage for persistent auth state
- Export atoms and helper functions for login, logout, verify OTP
- Create derived atoms for computed values (e.g., isAuthenticated)

### 3. Create Login Screen

- **File**: `src/screens/LoginScreen.tsx`
- Phone number input with auto-detection using `react-native-phone-number-input`
- Display country code picker
- Auto-fetch device phone number (if available)
- "Continue" button with gradient styling (matching theme)
- Validation for phone number format
- Navigate to OTP screen on successful phone number entry
- Apply dark theme with neon accents
- Use Jotai atoms to store phone number

### 4. Create OTP Verification Screen

- **File**: `src/screens/OTPScreen.tsx`
- Simple single TextInput field for OTP (6 digits)
- Numeric keyboard only
- Max length validation (6 digits)
- Resend OTP button with countdown timer
- Verify button
- Display phone number being verified
- Error handling for invalid OTP
- Navigate to main app on successful verification
- Apply dark theme with neon accents
- Use Jotai atoms to read/write OTP and phone number

### 5. Update Navigation Structure

- **File**: `App.tsx`
- Create Stack Navigator wrapping Tab Navigator
- Add LoginScreen and OTPScreen to stack
- Implement conditional navigation based on auth state from Jotai
- Show login stack if not authenticated, tab navigator if authenticated
- Add proper screen transitions
- Use Jotai's `useAtomValue` to check auth state

### 6. Add Permissions (for auto-fetch phone number)

- **File**: `android/app/src/main/AndroidManifest.xml`
- Add READ_PHONE_STATE permission (Android)
- **File**: `ios/DramaDropApp/Info.plist`
- Add phone number access description (iOS)

### 7. Mock OTP Service (for development)

- **File**: `src/services/authService.ts`
- Mock function to send OTP (simulate API call)
- Mock function to verify OTP
- Return success/failure based on test OTP (e.g., "123456")
- Structure ready for real API integration

### 8. Update App Entry Point

- **File**: `App.tsx`
- Handle initial auth state check using Jotai atoms
- Show loading screen while checking auth state
- No provider needed (Jotai works without provider)

### 9. Style Refinement

- Ensure all login screens match dark theme
- Use neon blue/purple accents for buttons and highlights
- Consistent typography and spacing
- Smooth animations and transitions

## Files to Create

- `src/store/authAtoms.ts` - Jotai atoms for auth state
- `src/screens/LoginScreen.tsx`
- `src/screens/OTPScreen.tsx`
- `src/services/authService.ts` - mock OTP service

## Files to Modify

- `App.tsx` (add stack navigator and auth flow)
- `android/app/src/main/AndroidManifest.xml` (add permissions)
- `ios/DramaDropApp/Info.plist` (add phone number permission)

## Dependencies to Install

- `jotai` - state management
- `react-native-phone-number-input` - phone number input with auto-detection
- `@react-native-async-storage/async-storage` - for persistent storage
- `@react-navigation/stack` - stack navigation for auth flow

## Navigation Flow

1. App starts → Check auth state from Jotai atom
2. Not authenticated → Show LoginScreen
3. Enter phone number → Store in Jotai atom → Navigate to OTPScreen
4. Enter OTP in single input field → Verify → Update auth atom → Navigate to main app (Tab Navigator)
5. Authenticated → Show Tab Navigator directly