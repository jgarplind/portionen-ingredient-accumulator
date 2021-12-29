import React, { useEffect, useRef, useState } from "react";
import styles from "./ComboboxMultiSelect.module.css";

interface ISelectOption {
  label: string;
  value: string;
}

const Keys = {
  Backspace: "Backspace",
  Clear: "Clear",
  Down: "ArrowDown",
  End: "End",
  Enter: "Enter",
  Escape: "Escape",
  Home: "Home",
  Left: "ArrowLeft",
  PageDown: "PageDown",
  PageUp: "PageUp",
  Right: "ArrowRight",
  Space: " ",
  Tab: "Tab",
  Up: "ArrowUp",
};

const MenuActions = {
  Close: 0,
  CloseSelect: 1,
  First: 2,
  Last: 3,
  Next: 4,
  Open: 5,
  Previous: 6,
  Select: 7,
  Space: 8,
  Type: 9,
};

// filter an array of options against an input string
// returns an array of options that begin with the filter string, case-independent
function filterOptions(
  options: ISelectOption[] = [],
  filter: string,
  exclude: ISelectOption[] = []
) {
  return options.filter(({ label }) => {
    const matches = label.toLowerCase().indexOf(filter.toLowerCase()) === 0;
    return matches && !exclude.map((e) => e.label).includes(label);
  });
}

function getActionFromKey(key: string, menuOpen: boolean) {
  // handle opening when closed
  if (!menuOpen && key === Keys.Down) {
    return MenuActions.Open;
  }

  // handle keys when open
  if (key === Keys.Down) {
    return MenuActions.Next;
  } else if (key === Keys.Up) {
    return MenuActions.Previous;
  } else if (key === Keys.Home) {
    return MenuActions.First;
  } else if (key === Keys.End) {
    return MenuActions.Last;
  } else if (key === Keys.Escape) {
    return MenuActions.Close;
  } else if (key === Keys.Enter) {
    return MenuActions.CloseSelect;
  } else if (key === Keys.Backspace || key === Keys.Clear || key.length === 1) {
    return MenuActions.Type;
  }
}

// get updated option index
function getUpdatedLabel(
  current: string,
  max: number,
  action: number,
  filteredOptions: ISelectOption[]
) {
  switch (action) {
    case MenuActions.First:
      return filteredOptions[0].label;
    case MenuActions.Last:
      return filteredOptions[max].label;
    case MenuActions.Previous:
      return filteredOptions[
        Math.max(0, filteredOptions.findIndex((o) => o.label === current) - 1)
      ].label;
    case MenuActions.Next:
      return filteredOptions[
        Math.min(max, filteredOptions.findIndex((o) => o.label === current) + 1)
      ].label;
    default:
      return current;
  }
}

function isScrollable(element: HTMLElement | null) {
  return element && element.clientHeight < element.scrollHeight;
}

// ensure given child element is within the parent's visible scroll area
function maintainScrollVisibility(
  activeElement: HTMLElement | null,
  scrollParent: HTMLElement | null
) {
  if (activeElement === null || scrollParent === null) {
    return;
  }
  const { offsetHeight, offsetTop } = activeElement;
  const { offsetHeight: parentOffsetHeight, scrollTop } = scrollParent;

  const isAbove = offsetTop < scrollTop;
  const isBelow = offsetTop + offsetHeight > scrollTop + parentOffsetHeight;

  if (isAbove) {
    scrollParent.scrollTo(0, offsetTop);
  } else if (isBelow) {
    scrollParent.scrollTo(0, offsetTop - parentOffsetHeight + offsetHeight);
  }
}

const ID_BASE = "combo2";

export const ComboxboxMultiSelect = ({
  options,
  setSelectedValues,
}: {
  options: ISelectOption[];
  setSelectedValues: any;
}) => {
  const [filteredOptions, setFilteredOptions] = useState<ISelectOption[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<ISelectOption[]>([]);
  const [excludedOptions, setExcludedOptions] = useState<ISelectOption[]>([]);
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState(false);
  const [ignoreBlur, setIgnoreBlur] = useState(false);
  const [activeLabel, setActiveLabel] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    options.filter(({ label }) => {
      const matches = label.toLowerCase().indexOf(filter.toLowerCase()) === 0;
      return matches && !excludedOptions.map((eo) => eo.label).includes(label);
    });
  }, [options, filter, excludedOptions]);

  useEffect(() => {
    setFilteredOptions(filterOptions(options, filter));
  }, [filter]);

  useEffect(() => {
    const shouldBeOpen = filteredOptions.length > 0 && activeLabel !== "";
    open !== shouldBeOpen && setOpen(shouldBeOpen);
  }, [filteredOptions]);

  useEffect(() => {
    // // if active option is not in filtered options, set it to first filtered option
    if (
      activeLabel !== "" &&
      !filteredOptions.map((fo) => fo.label).includes(activeLabel)
    ) {
      const firstFilteredLabel = (
        options.find((o) => o.label === activeLabel) as ISelectOption
      ).label;
      onOptionChange(firstFilteredLabel);
    }
  }, [filteredOptions]);

  useEffect(() => {
    setSelectedValues(selectedOptions.map((so) => so.value));
  }, [selectedOptions]);

  const onInput = (event: React.SyntheticEvent) => {
    setFilter((event.currentTarget as HTMLInputElement).value);
  };

  const onInputBlur = () => {
    if (ignoreBlur) {
      setIgnoreBlur(false);
      return;
    }
    setOpen(false);
  };

  const onOptionMouseDown = () => {
    setIgnoreBlur(true);
  };

  // TODO: Maybe this row is missing `open ? this.el.classList.add("open") : this.el.classList.remove("open");`
  const openAndFocus = () => {
    setOpen(true);
    inputRef?.current?.focus();
  };

  const closeAndFocus = () => {
    setOpen(false);
    inputRef?.current?.focus();
  };

  const onInputKeyDown = (event: React.KeyboardEvent) => {
    const { key } = event;

    const max = filteredOptions.length - 1;

    const action = getActionFromKey(key, open);

    switch (action) {
      case MenuActions.Next:
      case MenuActions.Last:
      case MenuActions.First:
      case MenuActions.Previous:
        event.preventDefault();
        const nextFilteredLabel = getUpdatedLabel(
          activeLabel,
          max,
          action,
          filteredOptions
        );
        return onOptionChange(nextFilteredLabel);
      case MenuActions.CloseSelect:
        event.preventDefault();
        return updateOption(activeLabel);
      case MenuActions.Close:
        event.preventDefault();
        return closeAndFocus();
      case MenuActions.Open:
        return openAndFocus();
    }
  };

  const onOptionChange = (label: string) => {
    setActiveLabel(label);

    if (open && isScrollable(listboxRef.current)) {
      const activeOption = document.getElementById(`${ID_BASE}-${label}`);
      maintainScrollVisibility(activeOption, listboxRef.current);
    }
  };

  const onOptionClick = (label: string) => {
    onOptionChange(label);
    updateOption(label);
    inputRef.current?.focus();
  };

  const updateOption = (label: string) => {
    const isSelected = selectedOptions.map((so) => so.label).includes(label);

    if (isSelected) {
      removeOption(label);
    } else {
      selectOption(label);
    }

    setFilter("");
  };

  const removeOption = (label: string) => {
    setSelectedOptions(selectedOptions.filter((so) => so.label !== label));
  };

  const selectOption = (label: string) => {
    setActiveLabel(label);
    const selected = options.find((o) => o.label === label) as ISelectOption;
    setSelectedOptions([...selectedOptions, selected]);
  };

  return (
    <div className={styles.wrapper}>
      <label id="combo2-label" className={styles.comboLabel}>
        Välj recept
      </label>
      <span id="combo2-remove" style={{ display: "none" }}>
        remove
      </span>
      <ul className={styles.selectedOptions} id="combo2-selected">
        {selectedOptions.map((so) => {
          return (
            <li key={so.label}>
              <button
                aria-describedby={`${ID_BASE}-remove`}
                className={styles.removeOption}
                type="button"
                id={`${ID_BASE}-remove-${so.label}`}
                onClick={() => removeOption(so.label)}
              >
                {so.label}
              </button>
            </li>
          );
        })}
      </ul>
      <div className={[styles.combo, open ? styles.open : ""].join(" ")}>
        <div
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-owns="listbox2"
          className={styles.inputWrapper}
          ref={listboxRef}
        >
          <input
            aria-activedescendant={`${
              activeLabel ? `${ID_BASE}-${activeLabel}` : ""
            }`}
            aria-autocomplete="list"
            aria-labelledby="combo2-label combo2-selected"
            autoComplete="off"
            id={ID_BASE}
            className={styles.comboInput}
            type="text"
            onInput={onInput}
            onBlur={onInputBlur}
            onClick={openAndFocus}
            onKeyDown={onInputKeyDown}
            ref={inputRef}
            value={filter}
          />
        </div>
        <div
          className={styles.comboMenu}
          role="listbox"
          aria-multiselectable="true"
          id="listbox2"
        >
          {options.map(({ label }) => {
            const classList = [styles.comboOption];
            if (selectedOptions.map((so) => so.label).includes(label)) {
              classList.push(styles.optionSelected);
            }
            if (label === activeLabel) {
              classList.push(styles.optionCurrent);
            }
            return (
              <div
                aria-selected={
                  selectedOptions.map((so) => so.label).includes(label)
                    ? "true"
                    : "false"
                }
                className={classList.join(" ")}
                id={`${ID_BASE}-${label}`}
                key={label}
                onClick={() => onOptionClick(label)}
                onMouseDown={onOptionMouseDown}
                role="option"
                style={
                  filteredOptions.map((fo) => fo.label).includes(label)
                    ? { display: "block" }
                    : { display: "none" }
                }
              >
                {label}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
