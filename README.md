# Swish: Korean Vocabulary Cards

Learn Korean vocabulary by swiping through word cards, dating-app style.

Status: **Archived**

## Why
Flashcard apps feel like homework. Swiping makes vocab review quick and casual enough to do in spare minutes.

## Features
- Swipe left or right to move through cards, swipe up to favourite a word, swipe down to remove it from favourites
- Audio pronunciation, hints and word previews
- Choose which word sets to study
- Guest mode, plus sign-in through Firebase Auth to save favourites
- Vocab and favourites stored in Supabase
- Runs on iOS, Android and web through Expo, and installs as a PWA

## Stack
Expo (React Native) · TypeScript · NativeWind · Supabase · Firebase Auth

## Run locally
Needs a Firebase project and a Supabase project, set as `EXPO_PUBLIC_*` variables in `.env`.
```bash
npm install && npx expo start
```
