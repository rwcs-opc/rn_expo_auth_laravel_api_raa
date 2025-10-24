- cd safe_online_expo
- npm run android
- npm run ios
- npm run web
- /Users/raa/raa-imp/React_Native_App/expo_apps/safe_online_expo
- npx expo start
- npx expo prebuild
- npx expo install expo-dev-client
- eas build --platform android --profile development
- eas build --platform ios --profile development
- eas build --platform web --profile development
- eas build --platform web --profile production

# DATABASES
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'u577947378_safe_online',  # ⬅️ The name of the MySQL database you will create
        'USER': 'u577947378_safe_online',     # ⬅️ Your MySQL username (e.g., 'root')
        'PASSWORD': 'HaM3yH~vU2^', # ⬅️ Your MySQL password
        'HOST': 'srv1188.hstgr.io',           # ⬅️ Always use 127.0.0.1 for local connections
        'PORT': '3306',                # ⬅️ Default MySQL port
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",# ⬅️ ADD THIS LINE
            'connect_timeout': 30, # Set timeout to 30 seconds (default is often 10)
        }
    }
}%       


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