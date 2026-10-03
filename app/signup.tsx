import AuthForm from '../src/components/AuthForm';

export default function SignupScreen({
  onSignUp,
  onLogin,
}: {
  onSignUp: (email: string, password: string) => Promise<void>;
  onLogin: () => void;
}) {
  return (
    <AuthForm
      mode="signup"
      onSubmit={onSignUp}
      onSwitch={onLogin}
    />
  );
}