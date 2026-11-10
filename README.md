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

## Running it
Built with Expo for iOS, Android and web, backed by a Supabase project (vocab and favourites) and Firebase Auth. Configuration is through the `EXPO_PUBLIC_*` variables in `.env.example`.
