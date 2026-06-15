"use client";

import { Loader2, FilePlus, FilePen, FileSearch, Undo2, Pencil, Trash2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ToolCallBadgeProps {
  toolName: string;
  args: Record<string, unknown>;
  state: "call" | "result" | "partial-call";
}

function basename(path: string): string {
  return path.split("/").filter(Boolean).at(-1) ?? path;
}

function getLabel(toolName: string, args: Record<string, unknown>): string {
  const path = typeof args.path === "string" ? args.path : "";
  const name = basename(path);
  const command = args.command as string | undefined;

  if (toolName === "str_replace_editor") {
    switch (command) {
      case "create":      return `Creating ${name}`;
      case "str_replace":
      case "insert":      return `Editing ${name}`;
      case "view":        return `Reading ${name}`;
      case "undo_edit":   return `Undoing edit to ${name}`;
    }
  }

  if (toolName === "file_manager") {
    switch (command) {
      case "rename": return `Renaming ${name}`;
      case "delete": return `Deleting ${name}`;
    }
  }

  return toolName;
}

function getIcon(toolName: string, args: Record<string, unknown>): LucideIcon {
  const command = args.command as string | undefined;

  if (toolName === "str_replace_editor") {
    switch (command) {
      case "create":      return FilePlus;
      case "str_replace":
      case "insert":      return FilePen;
      case "view":        return FileSearch;
      case "undo_edit":   return Undo2;
    }
  }

  if (toolName === "file_manager") {
    switch (command) {
      case "rename": return Pencil;
      case "delete": return Trash2;
    }
  }

  return FilePen;
}

export function ToolCallBadge({ toolName, args, state }: ToolCallBadgeProps) {
  const label = getLabel(toolName, args);
  const Icon = getIcon(toolName, args);
  const isComplete = state === "result";

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200">
      {isComplete ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600 shrink-0" />
      )}
      <Icon className="w-3 h-3 text-neutral-500 shrink-0" />
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}
