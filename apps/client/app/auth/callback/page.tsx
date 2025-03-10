import { cookies, headers } from 'next/headers';

export default async function CallbackPage() {
  const cookie = (await cookies()).get('redirect');

  console.log(cookie);
  return <div>1</div>;
}
