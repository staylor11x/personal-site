"use client";

import { useEffect, useRef, useReducer } from "react";
import { HudPanel, HudPanelHeader } from "./site-primitives";
import { COMMANDS } from "../../lib/terminal/registry";

const PROMPT = "visitor@staylor ~$";
const MAX_HISTORY = 50;

type Line =
  | { kind: "banner"; text: string }
  | { kind: "input"; text: string }
  | { kind: "output"; text: string };

type State = {
  history: Line[];
  input: string;
};

type Action =
  | { type: "SET_INPUT"; value: string }
  | { type: "SUBMIT" };

const WELCOME: Line[] = [
  { kind: "banner", text: "SCOTT TAYLOR — engineering thoughtful systems" },
  { kind: "banner", text: "hint: type help" },
];

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_INPUT":
      return { ...state, input: action.value };
    case "SUBMIT": {
      const raw = state.input.trim();
      if (!raw) return { ...state, input: "" };
      if (raw === "clear") return { history: [], input: "" };

      const [cmd, ...args] = raw.split(/\s+/);
      const inputLine: Line = { kind: "input", text: `${PROMPT} ${raw}` };

      let outputLines: Line[];
      if (COMMANDS[cmd]) {
        const result = COMMANDS[cmd].handler(args);
        const lines = Array.isArray(result) ? result : [result];
        outputLines = lines.map((text) => ({ kind: "output" as const, text }));
      } else {
        outputLines = [{ kind: "output", text: `command not found: ${cmd}` }];
      }

      let next = [...state.history, inputLine, ...outputLines];
      if (next.length > MAX_HISTORY) next = next.slice(next.length - MAX_HISTORY);
      return { history: next, input: "" };
    }
    default:
      return state;
  }
}

export default function TerminalPanel() {
  const [state, dispatch] = useReducer(reducer, {
    history: WELCOME,
    input: "",
  });

  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom whenever history changes
  useEffect(() => {
    const el = outputRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [state.history]);

  function handleFocus() {
    inputRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function handleClick() {
    inputRef.current?.focus();
  }

  return (
    <section id="terminal" aria-label="Interactive terminal" className="scroll-mt-24">
      <HudPanel accentColor="green">
        <HudPanelHeader label="// NODE.005 — TERMINAL" accentColor="green" />

        {/* Output area */}
        <div
          ref={outputRef}
          role="log"
          aria-live="polite"
          aria-label="Terminal output"
          onClick={handleClick}
          className="h-[300px] overflow-y-auto cursor-text px-4 py-3 font-mono text-xs leading-relaxed sm:h-[400px]"
        >
          {state.history.map((line, i) => {
            if (line.kind === "banner") {
              return (
                <p key={i} className="text-accent-cyan">
                  {line.text}
                </p>
              );
            }
            if (line.kind === "input") {
              return (
                <p key={i} className="text-accent-green">
                  {line.text}
                </p>
              );
            }
            return (
              <p key={i} className="text-foreground-muted">
                {line.text}
              </p>
            );
          })}
        </div>

        {/* Prompt row */}
        <div className="flex items-center gap-2 border-t border-border-subtle px-4 py-2 font-mono text-xs">
          <span className="shrink-0 select-none text-accent-green" aria-hidden="true">
            {PROMPT}
          </span>
          <div className="relative flex flex-1 items-center">
            <input
              ref={inputRef}
              type="text"
              value={state.input}
              aria-label="Terminal input"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              onFocus={handleFocus}
              onChange={(e) => dispatch({ type: "SET_INPUT", value: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter") dispatch({ type: "SUBMIT" });
              }}
              className="w-full bg-transparent text-foreground caret-transparent outline-none"
            />
            {/* Blinking cursor — hidden when input has content; respects reduced-motion */}
            <span
              aria-hidden="true"
              className="cursor-blink pointer-events-none absolute top-0 font-mono text-xs text-accent-green"
              style={{ left: `${state.input.length}ch`, display: "inline-block" }}
            >
              ▋
            </span>
          </div>
        </div>
      </HudPanel>
    </section>
  );
}
