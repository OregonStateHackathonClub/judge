import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"



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
        <Input className="w-50 m-2.5"/>

        <div className="text-2xl pt-5">
          Team Members
        </div>
        <ul className="space-y-2 pl-10">
          <li>Your Username</li>
          <li><Button variant="outline">Add Teammate</Button></li>
        </ul>

        <div className="flex text-xl gap-2 pt-10">
          <Checkbox id="lft-box"/>
          <Label htmlFor="lft-box">Looking for additional team members</Label>
        </div>

        <div className="p-5 pl-10">
          <div>
            Contact Email
          </div>
          <Input type="email" placeholder="benny@beaverhacks.com" className="m-2.5 w-75" />

          <div> 
            Brief Project Description
          </div>
          <Textarea className="m-2.5"/>
        </div>

        <Button className="bg-green-500 hover:bg-green-600 w-30 h-10 rounded-4xl">Accept Team</Button>
      </form>

    </div>
  );
}