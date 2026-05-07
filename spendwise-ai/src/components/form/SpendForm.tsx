"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToolRow, type SpendFormValues } from "@/components/form/ToolRow";
import { defaultTool, useFormStore } from "@/store/formStore";

const schema = z.object({
  tools: z.array(z.object({
    id: z.string(),
    name: z.string().min(1),
    category: z.enum(["coding", "design", "writing", "meeting", "search", "other"]),
    seats: z.number().min(1),
    monthlyCost: z.number().min(0),
    billingCycle: z.enum(["monthly", "annual"]),
    usageScore: z.number().min(0).max(100),
  })).min(1),
});

export function SpendForm() {
  const router = useRouter();
  const { tools, setTools } = useFormStore();
  const form = useForm<SpendFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { tools },
  });
  const { fields, append } = useFieldArray({ control: form.control, name: "tools" });

  async function onSubmit(values: SpendFormValues) {
    setTools(values.tools);
    const response = await fetch("/api/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const audit = await response.json();
    router.push(`/audit/${audit.id}`);
  }

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Sparkles className="h-5 w-5 text-emerald-700" />
          Audit your AI stack
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          {fields.map((field, index) => (
            <ToolRow key={field.id} index={index} register={form.register} />
          ))}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              variant="secondary"
              onClick={() => append({ ...defaultTool, id: crypto.randomUUID(), name: "" })}
            >
              <Plus className="h-4 w-4" />
              Add tool
            </Button>
            <Button type="submit" className="sm:ml-auto">
              Generate audit
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
