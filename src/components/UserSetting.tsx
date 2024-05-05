"use client";

import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, RefreshCcw } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { changeAcceptMessages } from "@/actions/auth";
import { reFetchMessages } from "@/actions/message";

function UserSetting({ isAcceptingMessages }: { isAcceptingMessages: boolean }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });
  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  useEffect(() => {
    setValue("acceptMessages", isAcceptingMessages);
  }, [isAcceptingMessages]);

  // Handle switch change
  const handleSwitchChange = async () => {
    setIsSwitchLoading(true);
    const response = await changeAcceptMessages(!isAcceptingMessages);
    if (response.type === "error") {
      toast.error(response.message);
    } else {
      setValue("acceptMessages", !isAcceptingMessages);
      toast.success(response.message)
    }
    setIsSwitchLoading(false);
  };

  const handleButtonClick = async () => {
    setIsLoading(true);
    await reFetchMessages();
    setIsLoading(false);
  };
  return (
    <>
      <div className="mb-4">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator />
      <Button className="mt-4" variant="outline" onClick={handleButtonClick}>
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
    </>
  );
}

export default UserSetting;
