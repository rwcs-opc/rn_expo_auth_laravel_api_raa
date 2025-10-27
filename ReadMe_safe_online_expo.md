- cd safe_online_expo
- npm run android
- npm run ios
- npm run web
- /Users/raa/raa-imp/React_Native_App/expo_apps/safe_online_expo
# npx expo start
- npx expo prebuild
- npx expo install expo-dev-client
- eas build --platform android --profile development
- eas build --platform ios --profile development
- eas build --platform web --profile development
- eas build --platform web --profile production



# Firebase OTP Authentication
- Firebase Phone Authentication 2024
- Updated OTP Authentication in React Native Expo Using Firebase | Firebase Phone Authentication 2024
- https://www.youtube.com/watch?v=CzjHl9uo8tY
- https://rnfirebase.io/

- npm install --save @react-native-firebase/app
- npm install --save @react-native-firebase/auth
- npm install @react-native-firebase/firestore

- https://docs.expo.dev/develop/development-builds/create-a-build/
- npx expo install expo-dev-client
- eas build --platform android --profile development
- eas build --platform ios --profile development


# eas credentials

Configuration: Build Credentials M9W6WoVSJ- (Default)  
Keystore  
Type                JKS
Key Alias           fbb232221593ded31faf1c4f75905d02
MD5 Fingerprint     A0:44:65:08:D9:DC:FA:45:3E:60:5C:19:CC:C3:8B:C8
SHA1 Fingerprint    E5:1E:D6:82:BD:1D:1C:F1:42:C7:D5:37:FD:DE:AF:82:A5:BC:C4:DD
SHA256 Fingerprint  4D:8B:02:E9:D3:90:7F:A9:DD:34:94:AD:CD:ED:D9:43:C8:A0:A4:6A:C6:14:18:FA:32:D2:F5:15:1A:62:E9:4C
Updated             23 minutes ago

Configuration: Build Credentials qt92kDxeIi  
Keystore  
Type                JKS
Key Alias           490fc3916e029ba030843d5662bd0e5b
MD5 Fingerprint     60:BE:C5:3C:BC:73:41:16:F9:88:CC:9B:7F:93:5B:54
SHA1 Fingerprint    BA:3F:D6:0B:6B:83:61:BA:D1:E0:81:C0:18:16:58:5D:BD:67:21:C1
SHA256 Fingerprint  15:3D:AD:B4:D3:81:F3:BF:CC:70:38:10:19:80:0E:0A:DF:E4:88:72:CC:F3:90:CF:8B:C2:08:89:EF:4F:52:9A
Updated             13 seconds ago

# git repo
echo "# safe-online-rn-expo" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/rwcs-opc/safe-online-rn-expo.git
git push -u origin main

git commit -m 'firebase auth with rn expo, good interface'
git push -u origin main

this is my app to implement zomato like food/grocesary/medicine delivery system. create a home screen use images for curosel assets/images_safe_home/safe1.png, safe2.png, safe3.png. and create a login button in the screen

in this app i installed @react-native-firebase/app, auth, firestore. also configured in firebase for phone otp login with ./google-services.json. now  implement login with phone and otp, if user logins for first time the user will register with additional data (name, gender, age, address, district, state, country, pin, geo location) after save it will show the dashboard screen with bottom tab navigator with home, orders, profile, settings, help, about, logout


git commit -m 'mock otp 112233 firebase auth with rn expo, good interface 25 oct 2025'
git commit -m 'configured for Firebase Development Build 25 oct 2025'

# git restore to laravel_api_otp 
- mock otp 112233 firebase auth with rn expo, good interface 25 oct 2025
- git checkout -b laravel_api_otp e4a8aef
- git push -u origin laravel_api_otp
- git commit -m 'laravel api otp, first version with mock otp 26 oct 2025'

- git commit -m 'laravel api otp, api otp verified otp 26 oct 2025'
- git commit -m 'auth flow, registration working, v3 26 oct 2025'


# Expo Router project using bottom Tab Navigator Folder Structure
app/
 ├── (tabs)/          # Bottom Tab Navigator screens
 │    ├── home.js
 │    ├── profile.js
 │    └── settings.js
 ├── auth/
 │    ├── login.js     # Login screen route
 │    └── register.js  # Register screen route
 └── _layout.js        # Root layout with authentication flow logic


git checkout -b laravel_api_otp_v2
git push origin laravel_api_otp_v2

git commit -m 'Authentication Logic Implementation with Laravel API 26 oct 2025'
git push -u origin laravel_api_otp_v2

# tree
tree -I "node_modules|components"
tree -I "node_modules"

# get user details
curl -X GET https://safe-online.rwcs.in/api/user \
  -H "Authorization: Bearer 50|fTYSr67gsV9uWCwY5fZYgZaHqZKkJcYzr0Y7ed8Lf8e5d2a2" \
  -H "Accept: application/json"
apiUser data:  {"created_at": "2025-10-26T05:08:48.000000Z", "email": "user@example.com", "email_verified_at": null, "id": 8, "name": "John Doe", "safe_user_detail": {"address_line1": "123 Main St", "address_line2": "Apt 4B", "age": 30, "city": "Sample City", "country": "Sample Country", "created_at": "2025-10-26T04:34:14.000000Z", "district": "Sample District", "email": "user@example.com", "email_otp": null, "gender": "male", "id": 1, "is_email_verified": false, "is_phone_verified": true, "latitude": "12.3456780", "longitude": "98.7654320", "name": "John Doe", "phone": "+917002453818", "phone_otp": null, "phone_verified_at": "2025-10-26T13:44:32.000000Z", "pin": "123456", "state": "Sample State", "updated_at": "2025-10-26T13:44:32.000000Z", "user_id": 8}, "two_factor_confirmed_at": null, "updated_at": "2025-10-26T05:08:48.000000Z"}    

curl -X GET https://safe-online.rwcs.in/api/user \
  -H "Authorization: Bearer <authToken>" \
  -H "Accept: application/json"


git commit -m 'Authentication Logic Implementation with Laravel API 26 oct 2025 v5'
git push -u origin laravel_api_otp_v2

git commit -m 'demo cart added 26 oct 2025 v6'
git push -u origin laravel_api_otp_v2


# Git new version
echo "# rn_expo_auth_laravel_api_raa" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/rwcs-opc/rn_expo_auth_laravel_api_raa.git
git push -u origin main

# push to new remote when one already exists
git remote -v
git remote set-url origin https://github.com/rwcs-opc/rn_expo_auth_laravel_api_raa.git
git checkout main
git push -u origin main
git push -u origin main --force

## This process will allow you to push your codebase from rn_expo_auth_laravel_api_raa into the new GitHub repository cleanly and safely

Action                      |  Command                                                                               
----------------------------+----------------------------------------------------------------------------------------
Set origin to new repo URL  |  git remote set-url origin https://github.com/rwcs-opc/rn_expo_auth_laravel_api_raa.git
Check out main branch       |  git checkout main                                                                     
Push branch                 |  git push -u origin main                                                               
Force push (if conflicts)   |  git push -u origin main --force                                                       

git commit -m 'RN Expo Auth App with laravel API & Phone OTP Auth date 27 oct 2025'
git push -u origin main

   