import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"


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

        <div className="flex w-full items-center gap-2 p-5">
          <Input className="h-15 w-75 !text-2xl uppercase" />
          <Button variant="outline" className="h-15 w-30 text-xl">
            Join Team
          </Button>
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