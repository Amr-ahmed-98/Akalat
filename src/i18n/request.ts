// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server'
import ar from '@/src/messages/ar.json'
import en from '@/src/messages/en.json'

// Static map — webpack can analyze this at build time
const messageMap: Record<string, Record<string, unknown>> = { ar, en }

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) ?? 'ar'
  const messages = messageMap[locale] ?? messageMap['ar']

  return {
    locale,
    messages,
  }
})

// Helper for your layout
export async function getMessages(locale: string) {
  const messages = messageMap[locale]
  if (!messages) throw new Error(`Messages not found for locale: ${locale}`)
  return messages
}