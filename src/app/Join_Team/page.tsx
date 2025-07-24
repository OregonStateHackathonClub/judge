

export default function Home() {
  return (
    <div className="w-[60%] mx-auto">
      <div className="text-4xl pt-5">
        Join a Team
      </div>

      <div className="pl-10">
        
        <div className="text-xl pt-10">
          Ask your group leader for an Invite Code:
        </div>

        <div className="flex gap-2 p-5">
          <input
            type="text"
            className="border px-2 py-1"
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-4xl hover:bg-blue-600">
            Join Team
          </button>
        </div>

        <div className="text-xl pt-10">
          Or browse groups searching for teammates:
        </div>

        <ul className="pb-2.5">
          <li className="pl-10 pt-2.5 pb-2.5 hover:bg-gray-100">Theoretical team</li>
          <li className="pl-10 pt-2.5 pb-2.5 hover:bg-gray-100">Totally real team</li>
        </ul>

      </div>

    </div>
  );
}