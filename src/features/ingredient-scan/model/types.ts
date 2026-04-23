export type ScanMode = "camera" | "barcode" | "text";

export type ScannerDraft =
  | { mode: "camera"; imageUrl: string | null }
  | { mode: "barcode"; barcodes: string[] }
  | { mode: "text"; text: string };

