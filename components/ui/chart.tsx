"use client"

import {
  LineChart as RechartsLineChart,
  Line as RechartsLine,
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  CartesianGrid as RechartsCartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer as RechartsResponsiveContainer,
  Legend as RechartsLegend,
  type LineChartProps,
  type LineProps,
  type XAxisProps,
  type YAxisProps,
  type CartesianGridProps,
  type TooltipProps,
  type ResponsiveContainerProps,
  type LegendProps,
} from "recharts"

export const LineChart = (props: LineChartProps) => {
  return <RechartsLineChart {...props} />
}

export const Line = (props: LineProps) => {
  return <RechartsLine {...props} />
}

export const XAxis = (props: XAxisProps) => {
  return <RechartsXAxis {...props} />
}

export const YAxis = (props: YAxisProps) => {
  return <RechartsYAxis {...props} />
}

export const CartesianGrid = (props: CartesianGridProps) => {
  return <RechartsCartesianGrid {...props} />
}

export const Tooltip = (props: TooltipProps) => {
  return <RechartsTooltip {...props} />
}

export const ResponsiveContainer = (props: ResponsiveContainerProps) => {
  return <RechartsResponsiveContainer {...props} />
}

export const Legend = (props: LegendProps) => {
  return <RechartsLegend {...props} />
}
