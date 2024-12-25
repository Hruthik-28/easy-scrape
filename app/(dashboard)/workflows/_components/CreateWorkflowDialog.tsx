"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CustomDialogHeader from "@/components/CustomDialogHeader";
import { Layers2Icon, Loader2 } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  createWorkflowSchema,
  CreateWorkFlowSchemaType,
} from "@/schema/workflow";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { CreateWorkFlow } from "@/actions/workflows/createWorkFlow";
import { toast } from "sonner";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

function CreateWorkflowDialog({ triggerText }: { triggerText?: string }) {
  const router = useRouter();

  const form = useForm<CreateWorkFlowSchemaType>({
    resolver: zodResolver(createWorkflowSchema),
    defaultValues: { name: "", description: "" },
  });

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: CreateWorkFlow,
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Workflow created", { id: "create-workflow" });
        router.push(`/workflow/editor/${result.workflowId}`);
      }
    },
    onError: (error) => {
      console.error("Mutation Error: ", error);
      toast.error("Failed to create workflow", { id: "create-workflow" });
    },
  });

  const onSubmit = useCallback(
    (values: CreateWorkFlowSchemaType) => {
      toast.loading("Creating workflow...", { id: "create-workflow" });
      mutate(values);
    },
    [mutate]
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{triggerText ?? "Create Workflow"}</Button>
      </DialogTrigger>
      <DialogContent>
        <CustomDialogHeader
          icon={Layers2Icon}
          title={"Create Worfklow"}
          subTitle={"Start building your workflow"}
        />

        <div className="py-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Name{" "}
                      <span className="text-xs font-semibold text-primary">
                        (required)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a descriptive and unique name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Description{" "}
                      <span className="text-xs text-muted-foreground font-semibold">
                        (optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} className="resize-none" />
                    </FormControl>
                    <FormDescription className="text-muted-foreground">
                      Provide a brief description of what your workflow does.
                      <br />
                      This is optional but can help you remember the
                      workflow&apos;s purpose
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={isPending || isSuccess}
              >
                {!isPending && !isSuccess && "Proceed"}
                {isPending && (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating workflow
                  </>
                )}
                {isSuccess && (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Redirecting to editor
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateWorkflowDialog;
