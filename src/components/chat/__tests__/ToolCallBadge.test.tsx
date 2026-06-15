import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallBadge } from "../ToolCallBadge";

afterEach(() => {
  cleanup();
});

// --- str_replace_editor label mapping ---

test("str_replace_editor create shows Creating <filename>", () => {
  render(<ToolCallBadge toolName="str_replace_editor" args={{ command: "create", path: "/src/App.tsx" }} state="call" />);
  expect(screen.getByText("Creating App.tsx")).toBeDefined();
});

test("str_replace_editor str_replace shows Editing <filename>", () => {
  render(<ToolCallBadge toolName="str_replace_editor" args={{ command: "str_replace", path: "/src/components/Card.tsx" }} state="call" />);
  expect(screen.getByText("Editing Card.tsx")).toBeDefined();
});

test("str_replace_editor insert shows Editing <filename>", () => {
  render(<ToolCallBadge toolName="str_replace_editor" args={{ command: "insert", path: "/src/lib/utils.ts" }} state="call" />);
  expect(screen.getByText("Editing utils.ts")).toBeDefined();
});

test("str_replace_editor view shows Reading <filename>", () => {
  render(<ToolCallBadge toolName="str_replace_editor" args={{ command: "view", path: "/src/index.tsx" }} state="call" />);
  expect(screen.getByText("Reading index.tsx")).toBeDefined();
});

test("str_replace_editor undo_edit shows Undoing edit to <filename>", () => {
  render(<ToolCallBadge toolName="str_replace_editor" args={{ command: "undo_edit", path: "/src/components/Button.tsx" }} state="call" />);
  expect(screen.getByText("Undoing edit to Button.tsx")).toBeDefined();
});

// --- file_manager label mapping ---

test("file_manager rename shows Renaming <filename>", () => {
  render(<ToolCallBadge toolName="file_manager" args={{ command: "rename", path: "/src/old.tsx", new_path: "/src/new.tsx" }} state="call" />);
  expect(screen.getByText("Renaming old.tsx")).toBeDefined();
});

test("file_manager delete shows Deleting <filename>", () => {
  render(<ToolCallBadge toolName="file_manager" args={{ command: "delete", path: "/src/temp.ts" }} state="call" />);
  expect(screen.getByText("Deleting temp.ts")).toBeDefined();
});

// --- fallback ---

test("unknown tool name falls back to toolName", () => {
  render(<ToolCallBadge toolName="some_unknown_tool" args={{ command: "foo", path: "/x" }} state="call" />);
  expect(screen.getByText("some_unknown_tool")).toBeDefined();
});

test("known tool with unknown command falls back to toolName", () => {
  render(<ToolCallBadge toolName="str_replace_editor" args={{ command: "unknown_cmd", path: "/x.tsx" }} state="call" />);
  expect(screen.getByText("str_replace_editor")).toBeDefined();
});

// --- basename extraction ---

test("deep nested path shows only the filename", () => {
  render(<ToolCallBadge toolName="str_replace_editor" args={{ command: "create", path: "/very/deeply/nested/path/MyComponent.tsx" }} state="call" />);
  expect(screen.getByText("Creating MyComponent.tsx")).toBeDefined();
});

test("flat filename with no directories works correctly", () => {
  render(<ToolCallBadge toolName="str_replace_editor" args={{ command: "view", path: "README.md" }} state="call" />);
  expect(screen.getByText("Reading README.md")).toBeDefined();
});

test("path with trailing slash uses last non-empty segment", () => {
  render(<ToolCallBadge toolName="file_manager" args={{ command: "delete", path: "/src/components/" }} state="call" />);
  expect(screen.getByText("Deleting components")).toBeDefined();
});

// --- in-progress vs complete state ---

test("state=call shows spinner and no green dot", () => {
  const { container } = render(
    <ToolCallBadge toolName="str_replace_editor" args={{ command: "create", path: "/src/Foo.tsx" }} state="call" />
  );
  expect(container.querySelector(".animate-spin")).not.toBeNull();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});

test("state=partial-call shows spinner and no green dot", () => {
  const { container } = render(
    <ToolCallBadge toolName="str_replace_editor" args={{ command: "create", path: "/src/Foo.tsx" }} state="partial-call" />
  );
  expect(container.querySelector(".animate-spin")).not.toBeNull();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});

test("state=result shows green dot and no spinner", () => {
  const { container } = render(
    <ToolCallBadge toolName="str_replace_editor" args={{ command: "create", path: "/src/Foo.tsx" }} state="result" />
  );
  expect(container.querySelector(".bg-emerald-500")).not.toBeNull();
  expect(container.querySelector(".animate-spin")).toBeNull();
});

test("label is visible when in progress", () => {
  render(<ToolCallBadge toolName="str_replace_editor" args={{ command: "create", path: "/src/Foo.tsx" }} state="call" />);
  expect(screen.getByText("Creating Foo.tsx")).toBeDefined();
});

test("label is visible when complete", () => {
  render(<ToolCallBadge toolName="str_replace_editor" args={{ command: "create", path: "/src/Foo.tsx" }} state="result" />);
  expect(screen.getByText("Creating Foo.tsx")).toBeDefined();
});
