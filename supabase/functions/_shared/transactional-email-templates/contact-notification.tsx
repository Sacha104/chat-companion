/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Tornado'

interface ContactNotificationProps {
  name?: string
  email?: string
  message?: string
}

const ContactNotificationEmail = ({ name, email, message }: ContactNotificationProps) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>Nouveau message de {name || 'un utilisateur'} sur {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={brand}>{SITE_NAME}</Heading>
        <Heading style={h1}>Nouveau message de contact</Heading>
        <Text style={text}>
          Vous avez reçu un nouveau message depuis le formulaire de contact de {SITE_NAME}.
        </Text>
        <Hr style={hr} />
        <Text style={label}>Nom</Text>
        <Text style={value}>{name || 'Non renseigné'}</Text>
        <Text style={label}>E-mail</Text>
        <Text style={value}>{email || 'Non renseigné'}</Text>
        <Text style={label}>Message</Text>
        <Text style={value}>{message || 'Aucun message'}</Text>
        <Hr style={hr} />
        <Text style={footer}>
          Cet e-mail a été envoyé automatiquement depuis {SITE_NAME}.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ContactNotificationEmail,
  subject: (data: Record<string, any>) =>
    `[Tornado] Nouveau message de ${data.name || 'un utilisateur'}`,
  displayName: 'Contact notification',
  to: 'support@tornado.com',
  previewData: { name: 'Jean Dupont', email: 'jean@example.com', message: 'Bonjour, j\'ai une question...' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'DM Sans', Arial, sans-serif" }
const container = { padding: '32px 24px' }
const brand = { fontSize: '24px', fontWeight: 'bold' as const, color: 'hsl(210, 100%, 50%)', margin: '0 0 24px' }
const h1 = { fontSize: '20px', fontWeight: 'bold' as const, color: '#1a1a2e', margin: '0 0 16px', fontFamily: "'Space Grotesk', Arial, sans-serif" }
const text = { fontSize: '14px', color: '#555', lineHeight: '1.6', margin: '0 0 16px' }
const hr = { borderColor: '#e5e7eb', margin: '20px 0' }
const label = { fontSize: '12px', color: '#888', margin: '0 0 2px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const value = { fontSize: '14px', color: '#1a1a2e', margin: '0 0 16px', lineHeight: '1.5' }
const footer = { fontSize: '12px', color: '#999', margin: '24px 0 0' }
