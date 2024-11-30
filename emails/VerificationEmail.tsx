import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from '@react-email/components';

interface VerificationEmailProps {
  BASE_URL: string;
  username: string;
  otp: string;
}

export default function VerificationEmail({ BASE_URL, username, otp }: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Here&apos;s your verification code: {otp}</Preview>
      <Section>
        <Row>
          <Heading as="h2">Hello {username},</Heading>
        </Row>
        <Row>
          <Text>
            Thank you for registering. Please use the following verification code to complete your
            registration:
          </Text>
        </Row>
        <Row>
          <Text>{otp}</Text>
        </Row>
        <Row>
          <Text>This code will expire in 15 minutes.</Text>
          <Text>Use below link to verify your account</Text>
        </Row>
        <Row>
          <Button href={`${BASE_URL}/verify/${username}`} style={{ color: '#61dafb' }}>
            Verify here
          </Button>
        </Row>
        <Row>
          <Text>If you did not request this code, please ignore this email.</Text>
        </Row>
        {/* <Row>
          <Button
            href={`http://localhost:3000/verify/${username}`}
            style={{ color: '#61dafb' }}
          >
            Verify here
          </Button>
        </Row> */}
      </Section>
    </Html>
  );
}
