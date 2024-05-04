import { getMessages } from "@/actions/message";
import { MessageCard } from "@/components/MessageCard";
import { auth } from "@/app/auth";
import { User } from "next-auth";
import CopyToClipboard from "@/components/CopyToClipboard";
import { redirect } from "next/navigation";
import UserSetting from "@/components/UserSetting";

async function UserDashboard() {
  const session = await auth();
  const _user: User = session?.user;
  if (!_user) {
    redirect("/");
  }

  const response = await getMessages();
  const messages = response.messages;

  const BASE_URl = process.env.BASE_URL;

  const profileUrl = `${BASE_URl}/u/${_user.username}`;

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <CopyToClipboard profileUrl={profileUrl} />
        </div>
      </div>

      <UserSetting isAcceptingMessages={_user.isAcceptingMessages!} />

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages?.length! > 0 ? (
          messages?.map((message, index) => (
            <MessageCard key={message.id} message={message} />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
