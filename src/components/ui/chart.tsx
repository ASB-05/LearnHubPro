"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "./utils";

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = { config: ChartConfig };

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const ctx = React.useContext(ChartContext);
  if (!ctx) throw new Error("useChart must be used within <ChartContainer>");
  return ctx;
}

export function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"];
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-layer]:outline-hidden [&_.recharts-surface]:outline-hidden",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const colorConfig = Object.entries(config).filter(
    ([, c]) => c.theme || c.color
  );
  if (!colorConfig.length) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, item]) => {
    const color =
      item.theme?.[theme as keyof typeof item.theme] || item.color;
    return color ? `  --color-${key}: ${color};` : "";
  })
  .join("\n")}
}`
          )
          .join("\n"),
      }}
    />
  );
}

// ---- Tooltip + Legend Components ----

// loosen tooltip prop types to avoid v2/v3 mismatches
const ChartTooltip = RechartsPrimitive.Tooltip as React.FC<any>;
const ChartLegend = RechartsPrimitive.Legend as React.FC<any>;

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: any) {
  const { config } = useChart();
  const safePayload = Array.isArray(payload) ? payload : [];

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || safePayload.length === 0) return null;
    const [item] = safePayload;
    const key = `${labelKey || item?.dataKey || item?.name || "value"}`;
    const itemConfig = getPayloadConfig(config, item, key);
    const value =
      !labelKey && typeof label === "string"
        ? config[label]?.label || label
        : itemConfig?.label;

    if (labelFormatter)
      return (
        <div className={cn("font-medium", labelClassName)}>
          {labelFormatter(value, safePayload)}
        </div>
      );

    return value ? (
      <div className={cn("font-medium", labelClassName)}>{value}</div>
    ) : null;
  }, [label, labelFormatter, safePayload, hideLabel, labelClassName, config, labelKey]);

  if (!active || safePayload.length === 0) return null;
  const nestLabel = safePayload.length === 1 && indicator !== "dot";

  return (
    <div
      className={cn(
        "border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl",
        className
      )}
    >
      {!nestLabel && tooltipLabel}
      <div className="grid gap-1.5">
        {safePayload.map((item: any, i: number) => {
          const key = `${nameKey || item.name || item.dataKey || "value"}`;
          const itemConfig = getPayloadConfig(config, item, key);
          const indicatorColor = color || item?.payload?.fill || item?.color;

          return (
            <div
              key={item?.dataKey ?? i}
              className={cn(
                "flex w-full flex-wrap items-stretch gap-2",
                indicator === "dot" && "items-center"
              )}
            >
              {!hideIndicator && (
                <div
                  className={cn({
                    "h-2.5 w-2.5": indicator === "dot",
                    "w-1": indicator === "line",
                    "w-0 border-[1.5px] border-dashed bg-transparent":
                      indicator === "dashed",
                  })}
                  style={{
                    backgroundColor: indicatorColor,
                    borderColor: indicatorColor,
                  }}
                />
              )}
              <div className="flex flex-1 justify-between items-center">
                <span className="text-muted-foreground">
                  {itemConfig?.label || item.name}
                </span>
                {item.value && (
                  <span className="text-foreground font-mono font-medium tabular-nums">
                    {typeof item.value === "number"
                      ? item.value.toLocaleString()
                      : String(item.value)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: any) {
  const { config } = useChart();
  const safePayload = Array.isArray(payload) ? payload : [];
  if (safePayload.length === 0) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
    >
      {safePayload.map((item: any, i: number) => {
        const key = `${nameKey || item.dataKey || "value"}`;
        const itemConfig = getPayloadConfig(config, item, key);
        return (
          <div
            key={item?.value ?? i}
            className="flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3"
          >
            {!hideIcon && (
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{ backgroundColor: item?.color }}
              />
            )}
            {itemConfig?.label}
          </div>
        );
      })}
    </div>
  );
}

// ---- helper ----
function getPayloadConfig(config: ChartConfig, payload: any, key: string) {
  const payloadObj =
    typeof payload?.payload === "object" ? payload.payload : undefined;
  let configKey = key;

  if (typeof payload[key] === "string") configKey = payload[key];
  else if (payloadObj && typeof payloadObj[key] === "string")
    configKey = payloadObj[key];

  return config[configKey] ?? config[key];
}

export {
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
