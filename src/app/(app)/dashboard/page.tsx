import { getMessages } from '@/actions/message';
import { MessageCard } from '@/components/MessageCard';
import { auth } from '@/app/auth';
import { User } from 'next-auth';
import CopyToClipboard from '@/components/CopyToClipboard';
import { redirect } from 'next/navigation';
import UserSetting from '@/components/UserSetting';

async function UserDashboard() {
  const session = await auth();
  const _user: User = session?.user;
  if (!_user || !_user.id) {
    redirect('/');
  }

  const response = await getMessages();
  const messages = response.type === 'success' ? response.data : [];

  const BASE_URl = process.env.BASE_URL;

  const profileUrl = `${BASE_URl}/u/${_user.username}`;

  return (
    <div className="mx-4 my-8 w-full max-w-6xl rounded bg-white p-6 md:mx-8 lg:mx-auto">
      <h1 className="mb-4 text-4xl font-bold">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="mb-2 text-lg font-semibold">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered mr-2 w-full p-2"
          />
          <CopyToClipboard profileUrl={profileUrl} />
        </div>
      </div>

      <UserSetting isAcceptingMessages={_user.isAcceptingMessages!} />

      <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
        {(messages ?? []).length > 0 ? (
          messages?.map((message) => <MessageCard key={message.id} message={message} />)
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
