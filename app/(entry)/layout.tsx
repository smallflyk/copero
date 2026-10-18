import {localeMetadata} from '@/lib/i18n/metadata'
import {site} from '@/data/site'
import type {Metadata} from 'next'
import type {ReactNode} from 'react'
import SiteLayout from '@/components/SiteLayout'
import '../globals.css'
import '../interface.css'
export const metadata:Metadata=localeMetadata(site.title,site.description,'/','es')
export default function EntryLayout({children}:{children:ReactNode}){return <SiteLayout locale="es">{children}</SiteLayout>}
