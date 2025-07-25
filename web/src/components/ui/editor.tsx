import ace from "ace-builds";

import { useApperanceStore } from "@/storages/appearance";
import { cn } from "@/utils";

import "ace-builds/esm-resolver";
import { useEffect, useRef, useState } from "react";

type EditorProps = Omit<React.ComponentProps<"div">, "onChange"> & {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  lang?: string;
  tabSize?: number;
  showLineNumbers?: boolean;
  className?: string;
};

function Editor(props: EditorProps) {
  const {
    value,
    onChange,
    placeholder,
    lang,
    tabSize = 2,
    showLineNumbers = false,
    className,
    ...rest
  } = props;

  const { theme } = useApperanceStore();

  const editorRef = useRef<HTMLPreElement>(null);
  const editorInstance = useRef<ace.Ace.Editor | null>(null);

  const initialValueRef = useRef(value);

  const [focused, setFocused] = useState<boolean>(false);

  useEffect(() => {
    if (!editorRef.current) return;

    if (editorInstance.current) {
      editorInstance.current.destroy();
    }

    const editor = ace.edit(editorRef.current, {
      mode: `ace/mode/${lang || "text"}`,
      showPrintMargin: false,
      highlightActiveLine: false,
      highlightGutterLine: false,
      showGutter: showLineNumbers,
      showLineNumbers: showLineNumbers,
      tabSize: tabSize,
      useSoftTabs: true,
      wrap: true,
      fontSize: 15,
      fontFamily: "Ubuntu Sans Mono Variable",
      cursorStyle: "smooth",
      animatedScroll: true,
      fadeFoldWidgets: true,
      hScrollBarAlwaysVisible: false,
      selectionStyle: "text",
      placeholder: placeholder,
      useWorker: false,
    });

    editor.session.setValue(initialValueRef.current || "");
    editor.clearSelection();

    editor.container.style.lineHeight = "1.5";

    editor.on("change", () => {
      onChange?.(editor.getValue() || "");
    });

    editor.on("focus", () => {
      setFocused(true);
    });

    editor.on("blur", () => {
      setFocused(false);
    });

    editorInstance.current = editor;

    return () => {
      editor.destroy();
    };
  }, [lang, showLineNumbers, tabSize, placeholder, onChange]);

  useEffect(() => {
    const editor = editorInstance.current;
    if (editor) {
      editor.setTheme(
        `ace/theme/${theme === "light" ? "kuroir" : "github_dark"}`
      );
    }
  }, [theme]);

  useEffect(() => {
    const editor = editorInstance.current;
    if (editor && value !== editor.getValue()) {
      editor.session.setValue(value || "");
      editor.clearSelection();
      editor.moveCursorTo(0, 0);
    }
  }, [value]);

  return (
    <div
      className={cn([
        "relative",
        "w-full",
        "rounded-md",
        "border",
        "bg-input",
        "ring-offset-input",
        focused && [
          "outline-hidden",
          "ring-2",
          "ring-ring",
          "ring-offset-2",
          "border-transparent",
        ],
        className,
      ])}
      {...rest}
    >
      <div
        className={cn([
          "absolute",
          "left-0",
          "top-0",
          "bottom-0",
          "right-0",
          "inset-0",
          "p-2",
        ])}
      >
        <pre
          className={cn([
            "w-full",
            "min-h-full",
            "relative",
            "!bg-[transparent]",
          ])}
          ref={editorRef!}
        />
      </div>
    </div>
  );
}

export { Editor, type EditorProps };
