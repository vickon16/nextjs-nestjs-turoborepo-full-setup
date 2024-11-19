import { PropsWithChildren } from "react";

const AuthRootLayout = ({ children }: PropsWithChildren) => {
  return (
    <main className="flex h-screen w-full items-center justify-center px-4">
      {children}
    </main>
  );
};

export default AuthRootLayout;
