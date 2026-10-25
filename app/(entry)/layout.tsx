import {localeMetadata} from '@/lib/i18n/metadata'
import {site} from '@/data/site'
import type {Metadata,Viewport} from 'next'
import type {ReactNode} from 'react'
import SiteLayout from '@/components/SiteLayout'
import '../globals.css'
import '../interface.css'
import '../create-player.css'
import '../career-workspace.css'
export const viewport:Viewport={themeColor:'#0b2118',colorScheme:'dark',width:'device-width',initialScale:1,viewportFit:'cover'}
export const metadata:Metadata=localeMetadata(site.title,site.description,'/','es')
export default function EntryLayout({children}:{children:ReactNode}){return <SiteLayout locale="es">{children}</SiteLayout>}
