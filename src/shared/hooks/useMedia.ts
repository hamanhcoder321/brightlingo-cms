import { ref } from "vue";

export function useUploadMutation() {
  const isPending = ref(false);

  return {
    isPending,
    mutate: (
      files: File[],
      options: {
        onSuccess?: (data: any) => void;
        onError?: (error: Error) => void;
      },
    ) => {
      isPending.value = true;
      console.log("Uploading files:", files);
      setTimeout(() => {
        isPending.value = false;
        options.onSuccess?.(
          files.map(() => ({ url: "https://placeholder.com/image.png" })),
        );
      }, 1000);
    },
  };
}
