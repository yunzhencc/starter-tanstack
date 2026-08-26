import { createFileRoute } from '@tanstack/react-router';
import { CredentialsForm } from '#/features/auth/credentials-form';

export const Route = createFileRoute('/_guest/signup')({ component: () => <CredentialsForm mode="signup" /> });
