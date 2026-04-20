import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
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

  const onSubmit = async (values: FeedbackFormValues) => {
    try {
      // Replace this with your actual API call
      // e.g. await submitFeedback(values);
      console.log("Feedback submitted:", values);

      toast.success(t("feedback.toast.success"), {
        description: t("feedback.toast.successDescription"),
      });

      form.reset();
      removeFile();
    } catch {
      toast.error(t("feedback.toast.error"), {
        description: t("feedback.toast.errorDescription"),
      });
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