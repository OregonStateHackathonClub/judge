

export default function Home() {
  return (
    <div>
      <div className="flex w-full justify-center pt-20">
        <form className="flex flex-col gap-4 w-100 p-5 rounded-sm bg-gray-200">
          Username:
          <input
            type="text"
            placeholder="BennyDaBeaver"
            className="border px-2 py-1"
          />

          Password:
          <input
            type="text"
            placeholder="**********"
            className="border px-2 py-1"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}