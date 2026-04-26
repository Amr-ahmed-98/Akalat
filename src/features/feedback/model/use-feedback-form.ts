import { useState } from "react";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { api } from "@/src/shared/lib/axios";
import { getApiErrorMessage } from "@/src/features/auth/model/auth-api";
import { getAuthenticatedUser } from "@/src/features/auth/model/auth-sessions";
import type { SuccessEnvelope } from "@/src/features/auth/model/types";
import {
  feedbackSchema,
  type FeedbackFormValues,
} from "./feedbackSchema";

export const useFeedbackForm = () => {
  const t = useTranslations();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      type: undefined,
      importance: "normal",
      details: "",
      screenshot: undefined,
    },
  });

  const handleFileChange = (file: File | null) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (!file) {
      form.setValue("screenshot", undefined);
      setPreviewUrl(null);
      return;
    }
    form.setValue("screenshot", file, { shouldValidate: true });
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0] ?? null;
    handleFileChange(file);
  };

  const removeFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    handleFileChange(null);
  };

  const fileToBinaryString = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const chunkSize = 0x8000;

    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode(...chunk);
    }

    return btoa(binary);
  };

  const onSubmit = async (values: FeedbackFormValues) => {
    try {
      const currentUser = getAuthenticatedUser();
      const requiredPayload: {
        type: string;
        priority: string;
        details: string;
        screenshot?: string;
      } = {
        type: values.type,
        priority: values.importance,
        details: values.details,
      };

      const payloadWithOptional: {
        type: string;
        priority: string;
        details: string;
        senderName?: string;
        senderEmail?: string;
        screenshot?: string;
      } = {
        type: values.type,
        priority: values.importance,
        details: values.details,
      };

      if (currentUser?.name) {
        payloadWithOptional.senderName = currentUser.name;
      }

      if (currentUser?.email) {
        payloadWithOptional.senderEmail = currentUser.email;
      }

      if (values.screenshot) {
        const screenshotBinary = await fileToBinaryString(values.screenshot);
        payloadWithOptional.screenshot = screenshotBinary;
        requiredPayload.screenshot = screenshotBinary;
      }

      let response;

      try {
        response = await api.post<SuccessEnvelope<{ message?: string }>>(
          "/api/contact/messages",
          payloadWithOptional,
        );
      } catch (error) {
        // Some backends strictly validate optional fields (e.g. senderName format).
        // Retry with required-only payload to avoid rejecting valid feedback.
        if (!isAxiosError(error) || error.response?.status !== 400) {
          throw error;
        }

        response = await api.post<SuccessEnvelope<{ message?: string }>>(
          "/api/contact/messages",
          requiredPayload,
        );
      }

      const message = response.data.data.message || t("feedback.toast.success");

      toast.success(message);

      form.reset();
      removeFile();
    } catch (error) {
      toast.error(getApiErrorMessage(error, t("feedback.toast.errorDescription")));
    }
  };

  return {
    form,
    previewUrl,
    isDragging,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    removeFile,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting: form.formState.isSubmitting,
  };
};