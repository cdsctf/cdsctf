import { X as RemoveIcon } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { inputVariants, TextField } from "@/components/ui/text-field";
import { cn } from "@/utils";
import { FieldContext } from "./field";

/**
 * used for identifying the split char and use will pasting
 */
const SPLITTER_REGEX = /[\n#?=&\t,./-]+/;

/**
 * used for formatting the pasted element for the correct value format to be added
 */
const FORMATTING_REGEX = /^[^a-zA-Z0-9]*|[^a-zA-Z0-9]*$/g;

type TagsFieldProps = React.ComponentProps<"div"> & {
  value: Array<string>;
  onValueChange: (value: Array<string>) => void;
  placeholder?: string;
  maxItems?: number;
  minItems?: number;
};

type TagsFieldContextProps = {
  value: Array<string>;
  onValueChange: (value: Array<string>) => void;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
};

const TagFieldContext = React.createContext<TagsFieldContextProps | null>(null);

function TagsField(props: TagsFieldProps) {
  const {
    value,
    onValueChange,
    placeholder,
    maxItems,
    minItems,
    className,
    dir,
    ref,
    ...rest
  } = props;

  const context = React.useContext(FieldContext);

  if (!context) {
    throw new Error("TagsField must be used with in an Input");
  }

  const { size, disabled, hasIcon, hasExtraButton } = context;

  const [activeIndex, setActiveIndex] = useState(-1);
  const [inputValue, setInputValue] = useState("");
  const [disableInput, setDisableInput] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [isValueSelected, setIsValueSelected] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  const parseMinItems = minItems ?? 0;
  const parseMaxItems = maxItems ?? Infinity;

  const onValueChangeHandler = useCallback(
    (val: string) => {
      if (!value.includes(val) && value.length < parseMaxItems) {
        onValueChange([...value, val]);
      }
    },
    [value, onValueChange, parseMaxItems]
  );

  const RemoveValue = useCallback(
    (val: string) => {
      if (value.includes(val) && value.length > parseMinItems) {
        onValueChange(value.filter((item) => item !== val));
      }
    },
    [value, onValueChange, parseMinItems]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const tags = e.clipboardData.getData("text").split(SPLITTER_REGEX);
      const newValue = [...value];
      tags.forEach((item) => {
        const parsedItem = item.replace(FORMATTING_REGEX, "").trim();
        if (
          parsedItem.length > 0 &&
          !newValue.includes(parsedItem) &&
          newValue.length < parseMaxItems
        ) {
          newValue.push(parsedItem);
        }
      });
      onValueChange(newValue);
      setInputValue("");
    },
    [value, onValueChange, parseMaxItems]
  );

  const handleSelect = React.useCallback(
    (e: React.SyntheticEvent<HTMLInputElement>) => {
      const target = e.currentTarget;
      const selection = target.value.substring(
        target.selectionStart ?? 0,
        target.selectionEnd ?? 0
      );

      setSelectedValue(selection);
      setIsValueSelected(selection === inputValue);
    },
    [inputValue]
  );

  // ? suggest : a refactor rather then using a useEffect

  useEffect(() => {
    const VerifyDisable = () => {
      if (value.length - 1 >= parseMinItems) {
        setDisableButton(false);
      } else {
        setDisableButton(true);
      }
      if (value.length + 1 <= parseMaxItems) {
        setDisableInput(false);
      } else {
        setDisableInput(true);
      }
    };
    VerifyDisable();
  }, [value, parseMinItems, parseMaxItems]);

  // ? check: Under build , default option support
  // * support : for the uncontrolled && controlled ui

  /*  React.useEffect(() => {
        if (!defaultOptions) return;
        onValueChange([...value, ...defaultOptions]);
        }, []); */

  const handleKeyDown = useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation();

      const moveNext = () => {
        const nextIndex =
          activeIndex + 1 > value.length - 1 ? -1 : activeIndex + 1;
        setActiveIndex(nextIndex);
      };

      const movePrev = () => {
        const prevIndex =
          activeIndex - 1 < 0 ? value.length - 1 : activeIndex - 1;
        setActiveIndex(prevIndex);
      };

      const moveCurrent = () => {
        const newIndex =
          activeIndex - 1 <= 0
            ? value.length - 1 === 0
              ? -1
              : 0
            : activeIndex - 1;
        setActiveIndex(newIndex);
      };
      const target = e.currentTarget;

      switch (e.key) {
        case "ArrowLeft":
          if (dir === "rtl") {
            if (value.length > 0 && activeIndex !== -1) {
              moveNext();
            }
          } else {
            if (value.length > 0 && target.selectionStart === 0) {
              movePrev();
            }
          }
          break;

        case "ArrowRight":
          if (dir === "rtl") {
            if (value.length > 0 && target.selectionStart === 0) {
              movePrev();
            }
          } else {
            if (value.length > 0 && activeIndex !== -1) {
              moveNext();
            }
          }
          break;

        case "Backspace":
        case "Delete":
          if (value.length > 0) {
            if (activeIndex !== -1 && activeIndex < value.length) {
              RemoveValue(value[activeIndex]);
              moveCurrent();
            } else {
              if (target.selectionStart === 0) {
                if (selectedValue === inputValue || isValueSelected) {
                  RemoveValue(value[value.length - 1]);
                }
              }
            }
          }
          break;

        case "Escape":
          setActiveIndex(activeIndex === -1 ? value.length - 1 : -1);
          break;

        case "Enter":
          if (inputValue.trim() !== "") {
            e.preventDefault();
            onValueChangeHandler(inputValue);
            setInputValue("");
          }
          break;
      }
    },
    [
      activeIndex,
      value,
      inputValue,
      RemoveValue,
      dir,
      isValueSelected,
      selectedValue,
      onValueChangeHandler,
    ]
  );

  const mousePreventDefault = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.currentTarget.value);
    },
    []
  );

  return (
    <TagFieldContext.Provider
      value={{
        value,
        onValueChange,
        inputValue,
        setInputValue,
        activeIndex,
        setActiveIndex,
      }}
    >
      <div
        {...rest}
        ref={ref}
        dir={dir}
        className={cn(
          inputVariants({
            size,
            icon: hasIcon,
            extraBtn: hasExtraButton,
          }),
          [
            "gap-2",
            "overflow-hidden",
            "flex-wrap",
            "py-2",
            "h-auto",
            "items-center",
          ],
          className
        )}
        aria-disabled={disabled}
      >
        {value.map((item, index) => (
          <Badge
            tabIndex={activeIndex !== -1 ? 0 : activeIndex}
            key={item}
            aria-disabled={disableButton}
            data-active={activeIndex === index}
            className={cn([
              "h-6",
              "relative",
              "px-3",
              "rounded-full",
              "flex",
              "items-center",
              "gap-1",
              "data-[active='true']:ring-2",
              "data-[active='true']:ring-muted-foreground",
              "truncate",
              "aria-disabled:opacity-50",
              "aria-disabled:cursor-not-allowed",
            ])}
          >
            <span className="text-xs">{item}</span>
            <button
              type="button"
              aria-label={`Remove ${item} option`}
              aria-roledescription="button to remove option"
              disabled={disableButton}
              onMouseDown={mousePreventDefault}
              onClick={() => RemoveValue(item)}
              className={cn([
                "hover:cursor-pointer",
                "disabled:cursor-not-allowed",
              ])}
            >
              <span className="sr-only">Remove {item} option</span>
              <RemoveIcon
                className={cn(["h-4", "w-4", "hover:stroke-destructive"])}
              />
            </button>
          </Badge>
        ))}
        {!disableInput && (
          <TextField
            tabIndex={0}
            aria-label="input tag"
            disabled={disableInput || disabled}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            value={inputValue}
            onSelect={handleSelect}
            onChange={activeIndex === -1 ? handleChange : undefined}
            placeholder={placeholder}
            onClick={() => setActiveIndex(-1)}
            className={cn([
              "bg-transparent",
              "outline-0",
              "border-none",
              "min-w-fit",
              "flex-1",
              "focus-visible:outline-0",
              "focus-visible:ring-0",
              "focus-visible:ring-offset-0",
              "focus-visible:border-0",
              "placeholder:text-muted-foreground",
              "px-1",
              "py-0",
              "min-h-0",
              "h-5",
              activeIndex !== -1 && "caret-transparent",
            ])}
          />
        )}
      </div>
    </TagFieldContext.Provider>
  );
}

export { TagsField };
