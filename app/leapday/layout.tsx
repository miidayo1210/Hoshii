import DreamNav from "@/components/leapday/DreamNav";
import SparkleTap from "@/components/leapday/SparkleTap";
import StarBurst from "@/components/leapday/StarBurst";
import FloatingInfoButton from "@/components/leapday/FloatingInfoButton";

export default function Layout({ children }:{ children: React.ReactNode }){
  return (
    <div>
      <DreamNav />
      <SparkleTap />
      <StarBurst />
      <FloatingInfoButton />
      <div className="pb-16">{children}</div>
    </div>
  );
}
