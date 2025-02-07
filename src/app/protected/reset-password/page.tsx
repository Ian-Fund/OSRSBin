import { resetPasswordAction } from "@/src/app/actions";
import { FormMessage, Message } from "@/src/components/FormMessage";
import { SubmitButton } from "@/src/components/SubmitButton";
import { Input } from "@/src/components/ui/input";

export default async function ResetPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <form className="flex flex-col w-full max-w-md p-4 gap-2 [&>input]:mb-4">
      <h1 className="text-2xl font-medium">Reset password</h1>
      <p className="text-sm text-foreground/60">
        Please enter your new password below.
      </p>
      <label htmlFor="password">New password</label>
      <Input
        type="password"
        name="password"
        placeholder="New password"
        required
      />
      <label htmlFor="confirmPassword">Confirm password</label>
      <Input
        type="password"
        name="confirmPassword"
        placeholder="Confirm password"
        required
      />
      <SubmitButton formAction={resetPasswordAction}>
        Reset password
      </SubmitButton>
      <FormMessage message={searchParams} />
    </form>
  );
}
