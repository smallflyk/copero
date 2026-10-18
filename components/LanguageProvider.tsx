'use client'
import {createContext,useContext,type ReactNode} from 'react'
import type {Locale} from '@/lib/i18n/config'
const LanguageContext=createContext<Locale>('es')
export const useLanguage=()=>useContext(LanguageContext)
export default function LanguageProvider({locale,children}:{locale:Locale;children:ReactNode}){return <LanguageContext.Provider value={locale}>{children}</LanguageContext.Provider>}
