/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface EmailChangeEmailProps {
  siteName: string
  email: string
  newEmail: string
  confirmationUrl: string
}

export const EmailChangeEmail = ({ siteName, email, newEmail, confirmationUrl }: EmailChangeEmailProps) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>Confirmez le changement d'e-mail pour Pr@mpt</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={brand}>Pr@mpt</Heading>
        <Heading style={h1}>Confirmez le changement d'e-mail</Heading>
        <Text style={text}>
          Vous avez demandé à changer votre adresse e-mail pour Pr@mpt de{' '}
          <Link href={`mailto:${email}`} style={link}>{email}</Link>{' '}
          à{' '}
          <Link href={`mailto:${newEmail}`} style={link}>{newEmail}</Link>.
        </Text>
        <Text style={text}>Cliquez sur le bouton ci-dessous pour confirmer ce changement :</Text>
        <Button style={button} href={confirmationUrl}>
          Confirmer le changement
        </Button>
        <Text style={footer}>
          Si vous n'avez pas demandé ce changement, sécurisez votre compte immédiatement.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default EmailChangeEmail

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }
const container = { padding: '20px 25px' }
const brand = { fontSize: '28px', fontWeight: 'bold' as const, color: 'hsl(160, 60%, 45%)', margin: '0 0 24px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#000000', margin: '0 0 20px' }
const text = { fontSize: '14px', color: '#55575d', lineHeight: '1.5', margin: '0 0 25px' }
const link = { color: 'hsl(160, 60%, 45%)', textDecoration: 'underline' }
const button = { backgroundColor: 'hsl(160, 60%, 45%)', color: 'hsl(220, 14%, 10%)', fontSize: '14px', fontWeight: 'bold' as const, borderRadius: '12px', padding: '12px 20px', textDecoration: 'none' }
const footer = { fontSize: '12px', color: '#999999', margin: '30px 0 0' }
