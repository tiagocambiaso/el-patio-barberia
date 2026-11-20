"use client";

import { dispatchSelectService } from "@/lib/booking";
import { ArrowUpRightIcon } from "@/components/Icons";

interface SelectServiceButtonProps {
  serviceId: string;
  serviceName: string;
  featured?: boolean;
}

export function SelectServiceButton({
  serviceId,
  serviceName,
  featured = false,
}: SelectServiceButtonProps) {
  return (
    <button
      type="button"
      onClick={() => dispatchSelectService(serviceId)}
      aria-label={`Elegir ${serviceName} y pasar a reservar turno`}
      className={
        featured
          ? "group inline-flex w-full items-center justify-between border border-[#C28852] bg-[#C28852] px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#0E0D0C] transition-all hover:border-[#D8A472] hover:bg-[#D8A472] cursor-pointer"
          : "group inline-flex w-full items-center justify-between border border-[#F2EBE1]/18 bg-transparent px-5 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-[#F2EBE1] transition-all hover:border-[#C28852] hover:bg-[#C28852]/10 hover:text-[#F2EBE1] cursor-pointer"
      }
    >
      <span>Elegir este servicio</span>
      <ArrowUpRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </button>
  );
}
