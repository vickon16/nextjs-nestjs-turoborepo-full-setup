import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NavUser } from "@/components/shadcn-extras/nav-user";
import { getCurrentUser } from "@/lib/session";

const ProfilePage = async () => {
  const user = await getCurrentUser();
  console.log({ user: user?.user.name });

  return (
    <main className="min-h-full p-4">
      <div className="mb-4 flex items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Account Profile</h1>
        <Button>
          <Settings />
          Settings
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Your profile infor is Displayed Here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NavUser
              user={{ email: "nkachukwu@gmail.com", name: "Nkachukwu", id: 1 }}
              col
            />

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-center">
              <div>
                <h4 className="font-semibold text-lg">134</h4>
                <p className="text-sm text-muted-foreground">Post</p>
              </div>
              <div>
                <h4 className="font-semibold text-lg">32</h4>
                <p className="text-sm text-muted-foreground">Projects</p>
              </div>
              <div>
                <h4 className="font-semibold text-lg">123</h4>
                <p className="text-sm text-muted-foreground">Members</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button>Deploy</Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
};

export default ProfilePage;
