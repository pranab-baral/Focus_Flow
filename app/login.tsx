import AuthForm from '../src/components/AuthForm';

export default function LoginScreen({
  onLogin,
  onSignUp,
}: {
  onLogin: (email: string, password: string) => Promise<void>;
  onSignUp: () => void;
}) {
  return (
    <AuthForm
      mode="login"
      onSubmit={onLogin}
      onSwitch={onSignUp}
    />
  );
}