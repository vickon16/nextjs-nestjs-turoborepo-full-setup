import { PropsWithChildren } from "react";
import { Toaster } from "@/components/ui/sonner";
import ReactQueryProvider from "./ReactQueryProvider";

const Providers = async ({ children }: PropsWithChildren) => {
  return (
    <>
      <ReactQueryProvider>
        <Toaster />
        {children}
      </ReactQueryProvider>
    </>
  );
};

export default Providers;
