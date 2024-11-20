import { PropsWithChildren } from "react";

const AuthRootLayout = ({ children }: PropsWithChildren) => {
  return (
    <main className="flex h-screen w-full items-center justify-center px-4 [background-image:_linear-gradient(to_bottom,_#3c65e1,_#0090f9,_#00b5ff,_#1ad7ff,_#85f5ff)]">
      {children}
    </main>
  );
};

export default AuthRootLayout;
