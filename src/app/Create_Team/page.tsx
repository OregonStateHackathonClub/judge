

export default function Home() {
  return (
    <div className="w-[60%] mx-auto">
      <div className="text-4xl pt-5">
        Team Creation
      </div>

      <form className="pl-10">
        <div className="text-2xl pt-5">
          Team Name
        </div>
        <input
          type="text"
          className="border px-2 py-1"
        />
        <div className="text-2xl pt-10">
          Team Members
        </div>
        <ul className="space-y-2 pl-10">
          <li>Your Username</li>
          <li><button className="outline-1 px-4 py-1 rounded-4xl hover:bg-gray-100">Add Teammate</button></li>
          <li><button className="outline-1 px-4 py-1 rounded-4xl hover:bg-gray-100">Add Teammate</button></li>
          <li><button className="outline-1 px-4 py-1 rounded-4xl hover:bg-gray-100">Add Teammate</button></li>
        </ul>

        <div className="flex text-xl gap-2 pt-10">
          <input
            type="checkbox"
            className="w-4"
          />
          Looking for additional team members
        </div>

        <div className="p-5 pl-10">
          <div>
            Contact Info
          </div>
          <input
            type="text"
            className="border px-2 py-1"
          />

          <div>
            Brief Project Description
          </div>
          <textarea
            className="border px-2 py-1 resize-none"
          />
        </div>

        <button className="bg-green-500 text-white px-4 py-2 rounded-4xl hover:bg-green-600">
          Accept Team
        </button>
      </form>

    </div>
  );
}