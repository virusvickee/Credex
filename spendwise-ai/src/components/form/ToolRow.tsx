"use client";

import type { UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AuditToolInput } from "@/types";

export type SpendFormValues = {
  tools: AuditToolInput[];
};

type ToolRowProps = {
  index: number;
  register: UseFormRegister<SpendFormValues>;
};

export function ToolRow({ index, register }: ToolRowProps) {
  return (
    <div className="grid gap-4 rounded-lg border bg-white p-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor={`tools.${index}.name`}>Tool</Label>
        <Input id={`tools.${index}.name`} placeholder="ChatGPT" {...register(`tools.${index}.name`)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`tools.${index}.category`}>Category</Label>
        <select
          id={`tools.${index}.category`}
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          {...register(`tools.${index}.category`)}
        >
          <option value="coding">Coding</option>
          <option value="design">Design</option>
          <option value="writing">Writing</option>
          <option value="meeting">Meeting</option>
          <option value="search">Search</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`tools.${index}.seats`}>Seats</Label>
        <Input id={`tools.${index}.seats`} type="number" min="1" {...register(`tools.${index}.seats`, { valueAsNumber: true })} />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`tools.${index}.monthlyCost`}>Monthly cost per seat</Label>
        <Input id={`tools.${index}.monthlyCost`} type="number" min="0" {...register(`tools.${index}.monthlyCost`, { valueAsNumber: true })} />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`tools.${index}.usageScore`}>Usage score</Label>
        <Input id={`tools.${index}.usageScore`} type="number" min="0" max="100" {...register(`tools.${index}.usageScore`, { valueAsNumber: true })} />
      </div>
      <input type="hidden" value="monthly" {...register(`tools.${index}.billingCycle`)} />
    </div>
  );
}
