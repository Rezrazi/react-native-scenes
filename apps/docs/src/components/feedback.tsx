"use client";
import { cva } from "class-variance-authority";
import {
  Collapsible,
  CollapsibleContent,
} from "fumadocs-ui/components/ui/collapsible";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { usePathname } from "next/navigation";
import { type SyntheticEvent, useEffect, useState, useTransition } from "react";
import { cn } from "../lib/cn";
import { buttonVariants } from "./ui/button";

const rateButtonVariants = cva(
  "inline-flex items-center gap-2 rounded-full border px-3 py-2 font-medium text-sm disabled:cursor-not-allowed [&_svg]:size-4",
  {
    variants: {
      active: {
        true: "bg-fd-accent text-fd-accent-foreground [&_svg]:fill-current",
        false: "text-fd-muted-foreground",
      },
    },
  }
);

export type Feedback = {
  opinion: "good" | "bad";
  url?: string;
  message: string;
};

export type ActionResponse = {
  githubUrl: string;
};

interface Result extends Feedback {
  response?: ActionResponse;
}

export function Feedback({
  onRateAction,
}: {
  onRateAction: (url: string, feedback: Feedback) => Promise<ActionResponse>;
}) {
  const url = usePathname();
  const [previous, setPrevious] = useState<Result | null>(null);
  const [opinion, setOpinion] = useState<"good" | "bad" | null>(null);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const item = localStorage.getItem(`docs-feedback-${url}`);

    if (item === null) {
      return;
    }
    setPrevious(JSON.parse(item) as Result);
  }, [url]);

  useEffect(() => {
    const key = `docs-feedback-${url}`;

    if (previous) {
      localStorage.setItem(key, JSON.stringify(previous));
    } else {
      localStorage.removeItem(key);
    }
  }, [previous, url]);

  function submit(e?: SyntheticEvent) {
    if (opinion == null) {
      return;
    }

    startTransition(async () => {
      const feedback: Feedback = {
        opinion,
        message,
      };

      void onRateAction(url, feedback).then((response) => {
        setPrevious({
          response,
          ...feedback,
        });
        setMessage("");
        setOpinion(null);
      });
    });

    e?.preventDefault();
  }

  const activeOpinion = previous?.opinion ?? opinion;

  return (
    <Collapsible
      className="border-y py-3"
      onOpenChange={(v) => {
        if (!v) {
          setOpinion(null);
        }
      }}
      open={opinion !== null || previous !== null}
    >
      <div className="flex flex-row items-center gap-2">
        <p className="pe-2 font-medium text-sm">How is this guide?</p>
        <button
          className={cn(
            rateButtonVariants({
              active: activeOpinion === "good",
            })
          )}
          disabled={previous !== null}
          onClick={() => {
            setOpinion("good");
          }}
        >
          <ThumbsUp />
          Good
        </button>
        <button
          className={cn(
            rateButtonVariants({
              active: activeOpinion === "bad",
            })
          )}
          disabled={previous !== null}
          onClick={() => {
            setOpinion("bad");
          }}
        >
          <ThumbsDown />
          Bad
        </button>
      </div>
      <CollapsibleContent className="mt-3">
        {previous ? (
          <div className="flex flex-col items-center gap-3 rounded-xl bg-fd-card px-3 py-6 text-center text-fd-muted-foreground text-sm">
            <p>Thank you for your feedback!</p>
            <div className="flex flex-row items-center gap-2">
              <a
                className={cn(
                  buttonVariants({
                    color: "primary",
                  }),
                  "text-xs"
                )}
                href={previous.response?.githubUrl}
                rel="noreferrer noopener"
                target="_blank"
              >
                View on GitHub
              </a>

              <button
                className={cn(
                  buttonVariants({
                    color: "secondary",
                  }),
                  "text-xs"
                )}
                onClick={() => {
                  setOpinion(previous.opinion);
                  setPrevious(null);
                }}
              >
                Submit Again
              </button>
            </div>
          </div>
        ) : (
          <form className="flex flex-col gap-3" onSubmit={submit}>
            <textarea
              autoFocus
              className="resize-none rounded-lg border bg-fd-secondary p-3 text-fd-secondary-foreground placeholder:text-fd-muted-foreground focus-visible:outline-none"
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (!e.shiftKey && e.key === "Enter") {
                  submit(e);
                }
              }}
              placeholder="Leave your feedback..."
              required
              value={message}
            />
            <button
              className={cn(buttonVariants({ color: "outline" }), "w-fit px-3")}
              disabled={isPending}
              type="submit"
            >
              Submit
            </button>
          </form>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
