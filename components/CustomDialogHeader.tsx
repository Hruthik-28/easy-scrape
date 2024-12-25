import { LucideIcon } from "lucide-react";
import { DialogHeader, DialogTitle } from "./ui/dialog";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";

interface Props {
  title?: string;
  subTitle?: string;
  icon?: LucideIcon;

  titleClassName?: string;
  subTitleClassName?: string;
  iconClassName?: string;
}

function CustomDialogHeader(props: Props) {
  const Icon = props.icon;

  return (
    <DialogHeader>
      <DialogTitle>
        <div className="flex flex-col gap-3 py-2 justify-center items-center">
          {Icon && (
            <Icon
              className={cn("text-primary", props.iconClassName)}
              size={30}
            />
          )}

          {props.title && (
            <p
              className={cn(
                "font-semibold text-primary text-xl",
                props.titleClassName
              )}
            >
              Create workflow
            </p>
          )}

          {props.subTitle && (
            <p
              className={cn(
                "text-base text-muted-foreground",
                props.subTitleClassName
              )}
            >
              Start building your workflow
            </p>
          )}
        </div>
      </DialogTitle>

      <Separator />
    </DialogHeader>
  );
}

export default CustomDialogHeader;
